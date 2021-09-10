import React, {useState} from 'react';
import {View} from 'react-native';
import {useDispatch} from "react-redux";
import BottomSlideModal from "src/components/modals/BottomSlideModal";
import {ButtonUI} from "src/components/ui/ButtonUI";
import {GREEN, WHITE} from "src/constants";
import {NO_AUTH_MODAL_WARNING} from "src/constants/Modal";
import {isFunction} from "src/functions/isFunction";
import UseIsLoggedIn from "src/hooks/useIsLoggedIn";
import {showModal} from "src/redux/actions/ModalActions";
import FormOpinion from "src/screens/ProductScreen/parts/FormOpinion/FormOpinion";

export function NewComment(props) {
	const [commentModal, showCommentModal] = useState(false);
	const {isLoggedIn} = UseIsLoggedIn()
	const dispatch = useDispatch()

	const showAuth = () => {
		dispatch(showModal({
			modalContentType: NO_AUTH_MODAL_WARNING
		}))
	}

	const saveTempOpinion = opinion => {
		isFunction(props.saveTempOpinion) && props.saveTempOpinion(opinion)
	}

	const closeModal = () => {
		showCommentModal(false)
	}

	const handleClick = () => isLoggedIn ? showCommentModal(true) : showAuth()

	return (
		<View>
				<FormOpinion
					confirm_params={props.confirm_params}
					productName={props.productName}
					productImage={props.productImage}
					showModal={showCommentModal}
					closeModal={closeModal}
					saveTempOpinion={saveTempOpinion}
					id={props.id}
					product={props.product}
					isVisible={commentModal}
					onClose={closeModal}
				/>

			<ButtonUI
				style={{backgroundColor: GREEN, marginBottom: 25}}
				textColor={WHITE}
				buttonName={'Написать отзыв'}
				callback={handleClick}
			/>
		</View>
	);
}
