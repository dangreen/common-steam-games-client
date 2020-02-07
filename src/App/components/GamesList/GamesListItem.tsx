import React, {
	LiHTMLAttributes,
	Component
} from 'react';
import PropTypes from 'prop-types';
import {
	CombinePropsAndAttributes
} from '@flexis/ui/helpers';
import Link from '~/components/Link';
import {
	style,
	classes
} from './GamesList.st.css';

export interface IGamesListItemSelfProps {
	id: number;
	name: string;
}

export type IGamesListItemProps = CombinePropsAndAttributes<
	IGamesListItemSelfProps,
	LiHTMLAttributes<HTMLLIElement>
>;

export class GamesListItem extends Component<IGamesListItemProps> {

	static propTypes = {
		id:   PropTypes.number.isRequired,
		name: PropTypes.string.isRequired
	};

	render() {

		const {
			className,
			id,
			name,
			...props
		} = this.props;

		return(
			<li
				{...props}
				className={style(classes.item, className)}
			>
				<Link
					className={classes.link}
					href={`https://store.steampowered.com/app/${id}`}
					target='_blank'
				>
					<img
						className={classes.img}
						src={`http://cdn.akamai.steamstatic.com/steam/apps/${id}/header.jpg`}
						loading='lazy'
					/>
					{name}
				</Link>
			</li>
		);
	}
}
