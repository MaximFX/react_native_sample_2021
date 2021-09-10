import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {ASPHALT_GRAY, GREEN, HOLE_BLACK} from "src/constants";
import {width} from "src/constants/Layout";
import {NO_AUTH_MODAL_WARNING} from "src/constants/Modal";
import UseIsLoggedIn from "src/hooks/useIsLoggedIn";
import NewCommentIcon from "src/icon/modal/NewCommentIcon";
import {showModal} from "src/redux/actions/ModalActions";
import FormOpinion from "src/screens/ProductScreen/parts/FormOpinion/FormOpinion";

/**
 *
 * @param {Product} product
 * @param {function} saveTempOpinion
 * @param {boolean} shouldOpenNewOpinionOnInit
 *
 */
const NewOpinion = ({product, saveTempOpinion, shouldOpenNewOpinionOnInit = false}) => {
	const [isVisible, setIsVisible] = useState(false)
	const {isLoggedIn} = UseIsLoggedIn()

	const userData = useSelector(state => state.UserDataReducer.data.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (shouldOpenNewOpinionOnInit) {
			// На iOS без таймаута почему то не открывается модалка, хотя стейт меняется на true
			// todo: разобраться
			setTimeout(() => {
				setIsVisible(true)
			}, 200)
		}
	}, [shouldOpenNewOpinionOnInit])

	const handlePress = () => {
		if (isLoggedIn) {
			openModal()
		} else {
			dispatch(showModal({
				modalContentType: NO_AUTH_MODAL_WARNING
			}))
		}
	}

	const openModal = () => setIsVisible(true)
	const closeModal = () => setIsVisible(false)

	const handleSaveTempOpinion = opinion => saveTempOpinion(opinion)

	return (<>
		<TouchableOpacity style={styles.headerNewOpinion} onPress={handlePress}>
			<NewCommentIcon/>
		</TouchableOpacity>

		<FormOpinion
			confirm_params={product.confirm_params}
			productName={product.name}
			productImage={product.thumb}
			closeModal={closeModal}
			saveTempOpinion={handleSaveTempOpinion}
			id={product.id}
			product={product}
			isVisible={isVisible}
			onClose={closeModal}
		/>
	</>);
};

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		flexDirection: 'row',
		height: 30,
		justifyContent: 'space-between',
		width: width - 30
	},
	headerActionsWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 85
	},
	headerBack: {
		alignItems: 'center',
		flexDirection: 'row'
	},
	headerBackText: {
		color: ASPHALT_GRAY,
		fontSize: 12,
		marginLeft: 10
	},
	headerNewOpinion: {
		alignItems: 'center',
		backgroundColor: GREEN,
		borderRadius: 18,
		height: 36,
		justifyContent: 'center',
		width: 36,
	},
	headerSorting: {
		alignItems: 'center',
		backgroundColor: HOLE_BLACK,
		borderRadius: 18,
		height: 36,
		justifyContent: 'center',
		width: 36,
	},
	wrapper: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
	}
});

export default NewOpinion;
