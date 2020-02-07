import React, {
	HTMLAttributes,
	Component
} from 'react';
import {
	style,
	classes
} from './GamesList.st.css';

export * from './GamesListItem';

export type IProps = HTMLAttributes<HTMLUListElement>;

export default class GamesList extends Component<IProps> {

	render() {

		const {
			className,
			children,
			...props
		} = this.props;

		return(
			<ul
				{...props}
				className={style(classes.root, className)}
			>
				{children}
			</ul>
		);
	}
}
