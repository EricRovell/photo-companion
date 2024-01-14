<script lang="ts">
	import {
		Button,
		Form,
		Fieldset,
		InputNumber
	} from "@lib/components";
	import { dict } from "@lib/dict";

	import styles from "./settings.module.css";
</script>

<div class="{styles.page}">
	<h2>
		{dict["settings"]}
	</h2>
	<Form>
		<Fieldset legend="{dict["geoposition"]}">
			<InputNumber
				min={-90}
				max={90}
				inputmode="numeric"
			>
				{dict["latitude"]}
			</InputNumber>
			<InputNumber
				min={-180}
				max={180}
				inputmode="numeric"
			>
				{dict["longitude"]}
			</InputNumber>
			<Button type="button">
				{dict["get-geo-device"]}
			</Button>
		</Fieldset>
		<Fieldset className="{styles.submit}">
			<Button type="button">
				{dict["save"]}
			</Button>
			<Button type="button">
				{dict["reset"]}
			</Button>
		</Fieldset>
	</Form>
</div>
