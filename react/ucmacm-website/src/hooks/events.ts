import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';

const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

export const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const startTimeString = data.startTime;
        const endTimeString = data.endTime;
        let startTimeDate = new Date(startTimeString);
        let endTimeDate = new Date(endTimeString);

        const options: Intl.DateTimeFormatOptions = {
            hour: "numeric",
            minute: "numeric",
            hour12: true // Use 12-hour format
        };
        
        const month = monthNames[startTimeDate.getMonth()];
        const day = startTimeDate.getDate();
        const startTime = startTimeDate.toLocaleString('en-US', options);
        const endTime = endTimeDate.toLocaleString('en-US', options);

        return {...data, startTime, endTime, date: month + " " + day};
        
    });

    return events;
}