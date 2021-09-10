import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
import reactotron from "reactotron-react-native";

import {BoldText, MediumText} from "src/components/StyledText";
import {ASPHALT_GRAY, DEFAULT_SHADOW, GRAY, HOLE_BLACK, WHITE} from "src/constants";
import RatingBigStar from "src/icon/RatingBigStar";
import RatingStar from "src/icon/RatingStar";

export default class GlobalRating extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			count: [1, 2, 3, 4, 5]
		}
	}

	renderMiniStart(activeCount) {
		return (
			this.state.count.map((star, index) => (
				<RatingStar key={index}
										style={[styles.starMini, {fill: index + 1 <= activeCount ? HOLE_BLACK : ASPHALT_GRAY}]}/>
			))
		)
	}

	renderRow(activeCount, ratingStar) {
		return (
			<View style={styles.rating}>
				<View style={styles.stars}>
					{this.renderMiniStart(activeCount)}
				</View>
				<View style={styles.innerLine}>
					<View style={[styles.lineActive, {width: `${(100 * ratingStar) / this.props.rating.count}%`}]}/>
					<View style={styles.lineInActive}/>
				</View>
				<MediumText style={styles.number}>{ratingStar}</MediumText>
			</View>
		)
	}

	render() {

		const {count} = this.state;

		const {rating} = this.props;

		const headerStars = count.map((star, index) => renderStar(star, index, rating));

		return (
			<View style={styles.wrapper}>
				<View style={styles.header}>
					<View style={styles.stars}>
						{headerStars}
					</View>
					<BoldText onPress={() => reactotron.log('rating', rating)} style={styles.bigNumber}>{rating.avg} / 5 </BoldText>
				</View>
				{this.renderRow(5, rating.count_star_5)}
				{this.renderRow(4, rating.count_star_4)}
				{this.renderRow(3, rating.count_star_3)}
				{this.renderRow(2, rating.count_star_2)}
				{this.renderRow(1, rating.count_star_1)}
			</View>
		);
	}
}

const renderStar = (star, index, {avg}) => {

	const floatValue = avg
	const integerValue = Math.floor(avg)

	const remainder = floatValue - integerValue

	const shouldMarkFully = star < floatValue || (star === integerValue && remainder > 0.7) || ((star - floatValue) <= 0.3)

	const shouldMarkHalf = !shouldMarkFully && remainder > 0.2 && remainder < 0.7

	return (
		<RatingBigStar
			style={styles.star}
			fill={shouldMarkFully ? HOLE_BLACK : GRAY}
			key={index}
			isHalf={shouldMarkHalf}
		/>
	)
}

const styles = StyleSheet.create({

	bigNumber: {
		fontSize: 25
	},

	header: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginBottom: 20
	},

	innerLine: {
		borderRadius: 4,
		flex: 1,
		height: 2,
		marginLeft: 10,
		marginRight: 5,
	},

	lineActive: {
		backgroundColor: '#535353',
		borderRadius: 4,
		height: 2,
		left: 0,
		position: 'absolute',
		top: 0,
		zIndex: 2
	},

	lineInActive: {
		backgroundColor: '#AEAEAE',
		borderRadius: 4,
		height: 2,
		left: 0,
		position: 'absolute',
		top: 0,
		width: '100%',
		zIndex: 1
	},

	number: {
		color: '#535353',
		fontSize: 14,
		minWidth: 40,
		textAlign: 'right',
	},

	rating: {
		alignItems: 'center',
		flexDirection: 'row',
		marginBottom: 3,
	},

	star: {
		flexDirection: 'row',
		marginRight: 7,
		transform: [{scale: 0.8}]
	},

	starMini: {
		marginRight: 5
	},

	stars: {
		flexDirection: 'row',
	},

	wrapper: {
		backgroundColor: WHITE,

		borderRadius: 16,
		marginBottom: 30,
		paddingBottom: 25,
		paddingLeft: 20,
		paddingRight: 20,
		paddingTop: 25,

		...DEFAULT_SHADOW
	}
});
