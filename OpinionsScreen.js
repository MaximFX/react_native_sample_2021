import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {ActivityIndicator, StyleSheet, TouchableOpacity, View} from "react-native";

import ErrorBoundary from "src/components/ErrorBoundary";
import SortingModal from "src/components/SortingModal";
import {MediumText} from "src/components/StyledText";
import {ButtonUI} from "src/components/ui/ButtonUI";
import {CustomNavHeader} from "src/components/ui/CustomNavHeader";
import LoadFail from "src/components/ui/LoadFail";
import Spinner from "src/components/ui/Spinner";
import UserReview from "src/components/ui/UserReview";
import {BLACK, BLUE, GRAY, WHITE} from "src/constants";
import usePagination from "src/hooks/usePagination";
import CloseIcon from "src/icon/modal/CloseIcon";
import SortIcon from "src/icon/SortIcon";
import NewOpinion from "src/screens/OpinionsScreen/parts/NewOpinion";
import reactotron from "reactotron-react-native";
import {CONTENT_WIDTH, width} from "src/constants/Layout";
import RecyclerListLight from "src/components/RecyclerListLight";

const OpinionsScreen = props => {
	const {route} = props;

	const {shouldOpenNewOpinionOnInit, product} = route.params

	const [isLoading, setIsLoading] = useState(true)
	const [isSortModalVisible, setIsSortModalVisible] = useState(false)

	// Временый массив для отвывов, которые написал сам пользователь
	const [tempOpinions, setTempOpinions] = useState([])

	const navigation = useNavigation();

	const {
		applySort,
		error,
		getAvailableSorting,
		getCurrentSorting,
		hasNextPage,
		pagination,
		items = [],
		loadData: loadOpinions,
		loadMore: loadMoreOpinions,
	} = usePagination(route.params.opinions.getObjectsApiMethod);

	const sortFields = getAvailableSorting();
	const activeSort = getCurrentSorting();

	const goToProduct = () => {
		navigation.navigate('Product', {
			title: product.name,
			url: product.url
		});
	};

	const openSortModal = () => setIsSortModalVisible(true);

	const closeSortModal = () => setIsSortModalVisible(false);

	const handleSelectSort = sort => {
		closeSortModal()
		applySort(sort)
	}

	const saveTempOpinion = opinion => {
		setTempOpinions([...tempOpinions, opinion])
	}

	const renderHeader = () => {

		return (
			<View style={styles.header}>
				<View style={styles.headerActionsWrap}>
					<NewOpinion
						shouldOpenNewOpinionOnInit={shouldOpenNewOpinionOnInit}
						product={route.params.product}
						saveTempOpinion={saveTempOpinion}
					/>

					<TouchableOpacity style={styles.headerSorting} onPress={openSortModal}>
						<SortIcon/>
					</TouchableOpacity>

					<TouchableOpacity style={styles.headerClose} onPress={navigation.goBack}>
						<CloseIcon/>
					</TouchableOpacity>
				</View>
			</View>
		)
	}

	useEffect(() => {
		loadOpinions().finally(() => setIsLoading(false))
	}, [])

	const renderItem = (item) => (
		<UserReview
			parent_id={route.params.parent_id}
			productId={route.params.id}
			navigation={navigation}
			opinion={item}
			key={item.id}
			fullReview
			bigReview
		/>
	);

	const dataToRender = [...tempOpinions, ...items]

	const handleReachEnd = () => {
		hasNextPage && loadMoreOpinions(dataToRender)
	}

	if (isLoading) {
		return <Spinner/>
	}

	if (error) {
		return <LoadFail onRefresh={loadOpinions}/>
	}

	const flatListFooter = hasNextPage ? <ActivityIndicator size="large" color={BLUE}/> : null

	return (
		<View style={styles.wrapper}>
			<CustomNavHeader
				backButtonTitle={'К товару'}
				onBack={goToProduct}
			>
				{renderHeader()}
			</CustomNavHeader>

			<View style={styles.container}>
				{dataToRender.length === 0 && (
					<View style={{padding: 15,flex:1}}>
						<MediumText style={{textAlign: 'center'}}>У этого товара пока нет отзывов</MediumText>
					</View>
				)}

				{dataToRender.length > 0 && (
					<RecyclerListLight
						forceNonDeterministicRendering
						itemHeight={410}
						pagination={pagination}
						fullUrl={route.params.opinions.getObjectsApiMethod + activeSort}
						itemWidth={CONTENT_WIDTH}
						isHorizontal={false}
						renderItem={renderItem}
						onEndReached={handleReachEnd}
						onEndReachedThreshold={100}
						renderAheadOffset={width}
						renderFooter={flatListFooter}
						data={dataToRender}
						contentContainerStyle={{paddingTop: 15, paddingBottom: 70}}
					/>
				)}

				<ButtonUI
					buttonName="Вернуться к товару"
					callback={goToProduct}
					style={styles.button}
					textColor={WHITE}
				/>

				<SortingModal
					activeSort={activeSort}
					closeModal={closeSortModal}
					isVisible={isSortModalVisible}
					onSelect={handleSelectSort}
					sortingFields={sortFields}
				/>
			</View>
		</View>
	);
}

const SafeOptionsScreen = props => {
	const navigation = useNavigation();

	return (
		<ErrorBoundary onReset={navigation.goBack}>
			<OpinionsScreen {...props} />
		</ErrorBoundary>
	)
}

export default SafeOptionsScreen

const styles = StyleSheet.create({
	button: {
		backgroundColor: BLUE,
		marginBottom:5,
		marginRight:0,
	},

	container: {
		flex: 1,
		paddingLeft: 10,
		paddingRight: 10,
	},

	header: {
		alignItems: 'center',
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'flex-end',
	},

	headerActionsWrap: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: 130
	},

	headerClose: {
		alignItems: 'center',
		backgroundColor: GRAY,
		borderRadius: 18,
		height: 36,
		justifyContent: 'center',
		width: 36,
	},

	headerSorting: {
		alignItems: 'center',
		backgroundColor: BLACK,
		borderRadius: 18,
		height: 36,
		justifyContent: 'center',
		width: 36,
	},

	wrapper: {
		flex: 1,
	},
});
