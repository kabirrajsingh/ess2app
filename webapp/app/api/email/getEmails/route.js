import User from "@models/user";
import { ConnectToDb } from "@utils/db";
import { isAddressClose } from "@utils/geocode";
import getAccessToken from "@utils/gmailUtils";
import { NextResponse } from "next/server";
const publicFolderPath = process.env.UPLOAD_DIR
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');


const fetchMessageIds = async (accessToken, parsedMessages, after, before) => {
    console.log(after)
    console.log(before)
    try {
        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            // url: `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=from:(noreply@olacabs.com) has:attachment after:2023/12/13 before:2024/12/14`,
            url: `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=from:(noreply@olacabs.com) has:attachment after:${after} before:${before}`,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const response = await axios(config);
        const resultSize = response.data.resultSizeEstimate;
        if (resultSize === 0) {
            // No new messages found
            return [];
        }
        const messageList = response.data.messages;

        const idList = messageList.map(message => message.id);
        const newMessageIds = idList.filter(id => !parsedMessages.includes(id));

        return newMessageIds;
    } catch (error) {
        console.log("error at fetchMessageIds")
        console.log(error)
    }
}

const fetchEmailInfo = async (messageId, token) => {
    const config = {
        method: 'get',
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    const response = await axios(config);
    const emailInfo = response.data;

    return emailInfo;
};

const fetchAttachmentData = async (messageId, attachmentId, token) => {
    const config = {
        method: 'get',
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`,
        headers: {
            Authorization: `Bearer ${token}`,
        }
    };
    // console.log(`url is https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/attachments/${attachmentId}`)
    try {
        const response = await axios(config);

        // Check if response.data is a string before creating a Buffer

        if (typeof response.data.data === 'string') {
            const attachmentData = Buffer.from(response.data.data, 'base64');
            return attachmentData;
        } else {
            throw new Error('Invalid attachment data received.');
        }
    } catch (error) {
        console.error('Error fetching attachment data:', error);
        throw error;
    }

};

const saveAttachmentToFile = async (attachmentData, filePath) => {
    try {
        // Use the correct encoding for binary data (PDF)
        await fs.promises.writeFile(filePath, attachmentData);

        console.log(`Attachment saved to: ${filePath}`);
    } catch (error) {
        console.error('Error saving attachment:', error);
        throw error;
    }
};
const readFile = async (filePath) => {
    try {
        const fileData = await fs.promises.readFile(filePath);
        return fileData;
    } catch (error) {
        console.error('Error reading PDF file:', error.message);
        throw error;
    }
}


const addAttachmentToLog = async (filePath) => {
    try {

        const formData = new FormData();
        formData.append('fileUrl', filePath);
        console.log("fileUrlfield is", filePath);
        // Send the file to the Flask server
        // console.log("Works here")

        const response = await axios.post('http://127.0.0.1:5000/parse-pdf', formData, {
            headers: {
                ...formData.getHeaders(),
            },
            maxBodyLength: Infinity,
        });
        // console.log("Worksz here")
        // Check if the request was successful (status code 200)
        if (response.status == 200) {
            // Parse and log the response
            // console.log(response.data)
            const result = await response.data;
            return result;
        } else {
            // Log an error if the request was not successful
            console.error('Failed to send file. Server returned:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
};
async function sendToCreatelogAPI(receipt) {
    try {
        const apiUrl = "http://localhost:3000/api/create-log"; // Replace with your actual createlog API endpoint

        const response = await axios.post(apiUrl, receipt, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 200) {
            return response.data;
        } else {
            console.error('Failed to create log. Server returned:', response.status, response.statusText);
            throw new Error('Failed to create log.');
        }
    } catch (error) {
        console.error('Error sending to createlog API:', error.message);
        throw error;
    }
}

export async function POST(req, res) {

    const reqbody = await req.json();

    await ConnectToDb();
    const { EmployeeID, after, before } = reqbody;

    const user = await User.findOne({ EmployeeID: EmployeeID });



    if (!user) {
        return NextResponse.json({ error: "Incorrect Employee ID" }, { status: 500 });
    }

    const refreshToken = user.refreshToken;
    const accessToken = await getAccessToken(refreshToken);

    const parsedMessages = user.messageIds ? user.messageIds : [];
    const newMessageIds = await fetchMessageIds(accessToken, parsedMessages, after, before);
    if (newMessageIds.length === 0) {
        return NextResponse.json({
            status: 200,
            createdLogs: [],
            message: "No new emails found for the selected date range",
        });
    }
    const parsedReceipts = [];

    try {
        for (const messageId of newMessageIds) {
            const emailInfo = await fetchEmailInfo(messageId, accessToken);
            const attachmentIds = emailInfo.payload.parts
                .filter(part => part.filename && part.body.attachmentId)
                .map(part => part.body.attachmentId);

            for (const attachmentId of attachmentIds) {
                const attachmentData = await fetchAttachmentData(messageId, attachmentId, accessToken);
                const fileName = `attachment_${messageId}.pdf`;
                const filePath = path.join(publicFolderPath, '', fileName);
                await saveAttachmentToFile(attachmentData, filePath);
                const response = await addAttachmentToLog(fileName);
                response.FileUrl = fileName;
                response.ProofID = fileName;
                parsedReceipts.push(response);
            }

            const updatedUser = await User.findOneAndUpdate(
                { EmployeeID: EmployeeID },
                { $addToSet: { messageIds: { $each: newMessageIds } } },
                { new: true }  
            );

            await updatedUser.save();
        }

        const createdLogs = [];
        // console.log(parsedReceipts)
        for (const receipt of parsedReceipts) {

            const officeAddress = process.env.OFFICE_ADDRESS
            if (isAddressClose(receipt.FromPlace, officeAddress) || isAddressClose(receipt.ToPlace, officeAddress)) {
                receipt.EmployeeID = EmployeeID;
                receipt.PurposeOfTravel = 'work';
                receipt.TypeOfUpload = 'email';

                const createlogResponse = await sendToCreatelogAPI(receipt);
                createdLogs.push(createlogResponse.savedLog);
            }

        }

        return NextResponse.json({
            status: 200,
            createdLogs: createdLogs,
            message: `${createdLogs.length} Emails added`
        });
    } catch (error) {
        console.error(error);
    }
}