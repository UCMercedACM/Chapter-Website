export const SectionTitle = ({ title }: { title: string }) => {
	return (
		<div className="grid place-items-center pb-5">
			<div>
				<h1 className="text-4xl font-semibold tracking-wider font-hind text-tertiary">
					{title}
				</h1>
				<div className="w-full h-2.5 rounded-xl bg-secondary" />
			</div>
		</div>
	);
};
