import styles from "styles/Customizer.module.css";

// Components
import { FileSelector, SliderOption, Typography } from "@/components";

// Hooks
import useCustomizer from "hooks/useCustomizer";

// Constants
import { BUILDING_CUSTOMIZER_LABEL } from "constants/Titles";

export default function Customizer() {
	const { options } = useCustomizer();

	return (
		<div className={styles.container}>
			<FileSelector />
			<Typography>{BUILDING_CUSTOMIZER_LABEL}</Typography>
			{options.map((option) => {
				return (
					<SliderOption
						key={option.label}
						label={option.label}
						value={option.value}
						onChange={(e, v) => option.onChange(e, v)}
						max={option.max}
						step={option.step}
					/>
					);
				})}
		</div>
	);
}
