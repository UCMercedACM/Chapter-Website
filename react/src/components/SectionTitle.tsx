export const SectionTitle = ({ title }: { title: string }) => {
	return (
		<div className="grid place-items-center pb-5">
			<div>
				<h1 className="text-4xl font-hind tracking-wider font-semibold text-tertiary">
					{title}
				</h1>
				<div className="h-2.5 w-full rounded-xl bg-secondary" />
			</div>
		</div>
	);
};
