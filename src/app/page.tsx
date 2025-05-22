import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

export default function Home() {
	return (
		<div className="p-14">
			<div className="flex flex-col gap-y-4">
				<p className="text-rose-500">HEllo world</p>{" "}
				<div>
					<Button variant="elevated">Button</Button>
				</div>
				<div>
					<Input placeholder="this is as input" />
				</div>
				<div>
					<Progress value={14} />
				</div>
				<div>
					<Textarea placeholder="text area" />
				</div>
				<div>
					<Checkbox />
				</div>
			</div>
		</div>
	);
}
