import axios from "axios";
import { getDistance } from "./getDistance";

export const getCoordinates = async (address) => {
  const params = {
    auth: '235110264332316903805x62967',
    locate: address,
    region: 'IN',
    json: '1'
  };

  try {
    const response = await axios.get('https://geocode.xyz', { params });
    const coord = {
      latt: response.data.latt,
      longt: response.data.longt,
    };
    return coord; 
  } catch (error) {
    throw error; 
  }
};


export const isAddressClose=async(address1,address2)=>{
  const cord1=getCoordinates(address1);
  const cord2=getCoordinates(address2);
  const lat1 = cord1.latt;
  const long1 = cord1.longt;
  const lat2 = cord2.latt;
  const long2 = cord2.longt;
  const distance = getDistance(lat1, long1, lat2, long2);
  const maxDistance=process.env.MAX_DISTANCE_ALLOWED
  if (distance<maxDistance) {
    return true
  }
  return false;
}
