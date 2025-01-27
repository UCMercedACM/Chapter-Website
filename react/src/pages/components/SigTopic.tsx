import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/react";
import { SectionTitle } from "./SectionTitle";

interface Event {
	title: string;
	date: string;
	time: string;
	description: string;
	location: string;
}

interface SigTopicProps {
	title: string;
	description: string;
	events: Event[];
}

const SigTopic = ({ title, description, events }: SigTopicProps) => {
	return (
		<>
			<SectionTitle title={title} />
			<p className="">{description}</p>
			<h3 className="mt-8 font-bold text-tertiary">UPCOMING EVENTS:</h3>
			<div className="my-8 mx-4">
				<Table aria-label="SIG Event list" fullWidth={false}>
					<TableHeader>
						<TableColumn>Date & Time</TableColumn>
						<TableColumn>Event</TableColumn>
						<TableColumn>Location</TableColumn>
					</TableHeader>
					<TableBody>
						{events.map((event) => (
							<TableRow key={event.title}>
								<TableCell>
									{event.date} - {event.time}
								</TableCell>
								<TableCell>{event.title}</TableCell>
								<TableCell>{event.location}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default SigTopic;
