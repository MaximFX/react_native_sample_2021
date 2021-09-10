import React, {useState} from "react";
import {StyleSheet, View,} from "react-native";
import {BoldText} from 'src/components/StyledText';
import {ButtonUI} from "src/components/ui/ButtonUI";
import UserReview from "src/components/ui/UserReview";
// import {GET_OPINION_PHOTO} from "src/constants/api";
import {BLACK, BLUE, WHITE} from "src/constants";
import {SCREEN_SIDE_GAP} from "src/constants/Layout";
import GlobalRating from "src/screens/OpinionsScreen/parts/GlobalRating";
import {NewComment} from "src/screens/OpinionsScreen/parts/NewComment";
// import {useSelector} from "react-redux";

// const getTempOpinionImages = (images = []) => {
// 	return images.map(image => ({
// 		image: GET_OPINION_PHOTO + '/' + image.image,
// 		thumb: GET_OPINION_PHOTO + '/' + image.thumb
// 	}))
// }

export function Comments(props) {
	const [localItems, setLocalItems] = useState([]);
	// const userData = useSelector(state => state.UserDataReducer.data.user);

	const {items} = props.opinions.objects;

	if (!items) return null

	const itemsToRender = localItems.length > 0 ? [...localItems, ...items] : items
	const list = itemsToRender.map((opinion, index) => (
		<UserReview
			opinion={opinion}
			parent_id={props.parent_id}
			productId={props.id}
			key={index}
			fullReview
		/>
	));

	/**
	 * Добавление отзыва юзера, без запроса данных от сервера
	 */
	const saveTempOpinion = opinion => {
		setLocalItems([opinion, ...localItems])
	}

	function goToAllOpinions() {
		props.navigation.navigate('OpinionsScreen',
			{
				title: props.productName,
				opinions: props.opinions,
				product: props.product,
			}
		)
	}

	return (
		<View style={styles.wrapper}>
			<BoldText style={styles.title}>Отзывы</BoldText>

			{props.rating !== null && (
				<GlobalRating rating={props.rating}/>
			)}

			<NewComment
				producImage={props.producImage}
				saveTempOpinion={saveTempOpinion}
				confirm_params={props.confirm_params}
				id={props.id}
				productImage={props.productImage}
				productName={props.productName}
				product={props.product}
			/>

			{list}

			{props.opinionsCount > 5 && (
				<ButtonUI
					style={styles.button}
					textColor={WHITE}
					buttonName={'Смотреть все отзывы'}
					callback={goToAllOpinions}
				/>
			)}

		</View>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: BLUE,
		marginBottom: 15
	},

	title: {
		color: BLACK,
		fontSize: 24,
		marginBottom: 10
	},

	wrapper: {
		paddingLeft: SCREEN_SIDE_GAP,
		paddingRight: SCREEN_SIDE_GAP,
		paddingTop: 15,
	}
});
