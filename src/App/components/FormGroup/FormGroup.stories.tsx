import React from 'react';
import {
	storiesOf
} from '@storybook/react';
import {
	text
} from '@storybook/addon-knobs/react';
import FormGroupStories, {
	events
} from '@flexis/ui/components/FormGroup/FormGroup.stories';
import Textarea from '../Textarea';
import FormGroup from './';

storiesOf('Components|FormGroup', module)
	.addParameters(FormGroupStories.parameters)
	.add(
		'with textarea',
		() => (
			<FormGroup
				id='input-id'
				label={text('Label', 'Text label')}
			>
				<Textarea
					{...events}
				/>
			</FormGroup>
		)
	);
