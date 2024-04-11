import { SectionTitle } from './SectionTitle'
import {
    Table,
    TableHeader,
    TableBody,
    TableColumn,
    TableRow,
    TableCell
  } from "@nextui-org/react";

interface Event {
    name: string,
    startTime: string,
    endTime: string,
    description: string,
    location: string
    date: string;
}

const EventsTable = ({ events }: { events: Event[] }) => {
  return (
    <div className="mx-4 my-8">
        <Table 
            aria-label="SIG Event list" 
            fullWidth={false}
        >
            <TableHeader>
                <TableColumn>Date & Time</TableColumn>
                <TableColumn>Event</TableColumn>
                <TableColumn>Location</TableColumn>
            </TableHeader>
            <TableBody>
                {
                    events.map((event) => (
                    <TableRow key={event.name}>
                        <TableCell>{event.date}, {event.startTime} - {event.endTime}</TableCell>
                        <TableCell>{event.name}</TableCell>
                        <TableCell>{event.location}</TableCell>
                    </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    </div>
  )
}

export default EventsTable