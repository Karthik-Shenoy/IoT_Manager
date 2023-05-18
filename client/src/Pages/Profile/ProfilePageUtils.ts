export type SensorCardPayload = {
    sensorId: string;
    deviceId: string;
    lastReading: number;
    lastReadingTime: string;
    lastReadingDate: string;

}

export type EdgeCardPayload = {
    deviceName: string;
    deviceId: string;
    numSensors: number;
    lastUpdated: string;
}

export type EdgeDevice = {    
    deviceName: string;
    deviceId: string;
    sensors: SensorDevice[];
}

export type SensorDevice = {
    sensorId: string;
    time: string;
    metaData: string;
    data: number;
    date: string;
    deviceId: string; 
}

export const getHumanReadableDate = (rawDate: string): string =>{
    return rawDate.slice(7) + "/" + rawDate.slice(4,6) + "/" + rawDate.slice(1,3);
}