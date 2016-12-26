var apiHost = 'http://lzqy.iyiplus.com';
//var apiHost = 'http://qydemo.iyiplus.com';

module.exports = {
	//host: 'http://g.tbcdn.cn/gxzy/tobacco-lzqy/1.0.0',
	host: 'http://lzqystatic.iyiplus.com',
	//host: 'http://qydemofe.iyiplus.com',
	debug: false,
	startYear: 2010,      // 所有select的起始年份
	api: {
		/* 小组相关 */
		//'SEARCH_RETAIL_GROUP': '../../services/mock/searchRetailGroup.json', 
		'SEARCH_RETAIL_GROUP': apiHost + '/phone/group/searchRetailGroup.action', 
		//'GET_RETAIL_GROUP_DETAIL': '../../services/mock/getRetailGroupDetail.json',
		'GET_RETAIL_GROUP_DETAIL': apiHost + '/phone/group/getRetailGroupDetail.action',
		//'GET_MY_RETAIL_GROUP_DETAIL': '../../services/mock/getMyRetailGroupDetail.json',
		'GET_MY_RETAIL_GROUP_DETAIL': apiHost + '/phone/group/getRetailGroupDetail.action',
		
		/* 零售户店铺相关 */
		//'SEARCH_STORE': '../../services/mock/searchStore.json', 
		'SEARCH_STORE': apiHost + '/phone/shopkeeper/searchStore.action', 
		//'GET_STORE_DETAIL': '../../services/mock/getStoreDetail.json',
		'GET_STORE_DETAIL': apiHost + '/phone/shopkeeper/getStoreDetail.action',
		//'GET_STORE_PURCHASES_AND_SALES': '../../services/mock/getStorePurchasesAndSales.json',
		'GET_STORE_PURCHASES_AND_SALES': apiHost + '/phone/shopkeeper/getStorePurchasesAndSales.action',
		//'GET_MY_STORE_PURCHASES_AND_SALES': '../../services/mock/getMyStorePurchasesAndSales.json',
		'GET_MY_STORE_PURCHASES_AND_SALES': apiHost + '/phone/shopkeeper/getStorePurchasesAndSales.action',
		//'GET_MY_DISTRICT_PURCHASES_AND_SALES': '../../services/mock/getMyDistrictPurchasesAndSales.json',
		'GET_MY_DISTRICT_PURCHASES_AND_SALES': apiHost + '/phone/shopkeeper/getMyDistrictPurchasesAndSales.action',
		//'GET_STORE_PURCHASES_DETAIL': '../../services/mock/getStorePurchasesDetail.json',
		'GET_STORE_PURCHASES_DETAIL': apiHost + '/phone/shopkeeper/getStorePurchasesDetail.action',
		//'GET_MY_STORE_PURCHASES_DETAIL': '../../services/mock/getMyStorePurchasesDetail.json',
		'GET_MY_STORE_PURCHASES_DETAIL': apiHost + '/phone/shopkeeper/getStorePurchasesDetail.action',
		//'GET_MY_DISTRICT_PURCHASES_DETAIL': '../../services/mock/getMyDistrictPurchasesDetail.json',
		'GET_MY_DISTRICT_PURCHASES_DETAIL': apiHost + '/phone/shopkeeper/getMyDistrictPurchasesDetail.action',
		//'GET_STORE_TYPE': '../../services/mock/getStoreType.json',
		'GET_STORE_TYPE': apiHost + '/phone/shopkeeper/getStoreType.action',
		//'GET_STORE_GRANTS_DETAIL': '../../services/mock/getStoreGrantsDetail.json',
		'GET_STORE_GRANTS_DETAIL': apiHost + '/phone/score/getStoreGrantsDetail.action',
		//'GET_MY_STORE_GRANTS_DETAIL': '../../services/mock/getMyStoreGrantsDetail.json',
		'GET_MY_STORE_GRANTS_DETAIL': apiHost + '/phone/score/getStoreGrantsDetail.action',

		/* 无证户相关 */
		'SEARCH_BLACK_STORE': apiHost + '/phone/blackStore/searchBlackStore.action', 
		'GET_BLACK_STORE_DETAIL': apiHost + '/phone/blackStore/findStoreById.action',
		
		/* 核价相关 */
		//'SEARCH_PRODUCT': '../../services/mock/searchProduct.json', 
		'SEARCH_PRODUCT': apiHost + '/phone/cigar/searchProduct.action', 
		//'GET_PRODUCT_DETAIL': '../../services/mock/getProductDetail.json',
		'GET_PRODUCT_DETAIL': apiHost + '/phone/cigar/getProductDetail.action',

		/* 发送消息相关 */
		//'SEARCH_CONTACT': '../../services/mock/searchContact.json',
		'SEARCH_CONTACT': apiHost + '/phone/relatedToSendMsg/searchContact.action',
		//'GET_MY_CONTACT_COUNT': '../../services/mock/getMyContactCount.json',
		'GET_MY_CONTACT_COUNT': apiHost + '/phone/relatedToSendMsg/getMyContactCount.action',
		//'GET_CATCHPOLER_LIST': '../../services/mock/getCatchpolerList.json',
		'GET_CATCHPOLER_LIST': apiHost + '/phone/relatedToSendMsg/getCatchpolerList.action',
		//'GET_SUPERVISOR_LIST': '../../services/mock/getSupervisorList.json',
		'GET_SUPERVISOR_LIST': apiHost + '/phone/relatedToSendMsg/getSupervisorList.action',
		//'GET_MARKETER_LIST': '../../services/mock/getMarketerList.json',
		'GET_MARKETER_LIST': apiHost + '/phone/relatedToSendMsg/getMarketerList.action',
		//'GET_RETAIL_GROUP_LIST': '../../services/mock/getRetailGroupList.json',
		'GET_RETAIL_GROUP_LIST': apiHost + '/phone/relatedToSendMsg/getRetailGroupList.action',
		//'GET_STORE_LIST': '../../services/mock/getStoreList.json',
		'GET_STORE_LIST': apiHost + '/phone/relatedToSendMsg/getStoreList.action',
		//'SEND_MESSAGE': '../../services/mock/sendMessage.json',
		'SEND_MESSAGE': apiHost + '/phone/relatedToSendMsg/sendMessage.action',
		
		/* jssdk配置 */
		'GET_WX_JS_SDK_CONFIG': apiHost + '/phone/jsSdk.action',

		/* 巡访相关 */
		//'GET_MY_VISITING_STATUS': '../../services/mock/getMyVisitingStatus.json',
		'GET_MY_VISITING_STATUS': apiHost + '/phone/plan/getMyVisitingStatus.action',
		//'SEARCH_MY_SUPERVISED_STORE': '../../services/mock/searchMySupervisedStore.json',
		'SEARCH_MY_SUPERVISED_STORE': apiHost + '/phone/plan/searchMySupervisedStore.action',
		//'ADD_VISITING_PLAN': '../../services/mock/addVisitingPlan.json',
		'ADD_VISITING_PLAN': apiHost + '/phone/plan/addVisitingPlan.action',
		//'REMOVE_VISITING_PLAN': '../../services/mock/removeVisitingPlan.json',
		'REMOVE_VISITING_PLAN': apiHost + '/phone/plan/removeVisitingPlan.action',
		//'GET_VISITING_PLAN_LIST': '../../services/mock/getVisitingPlanList.json',
		'GET_VISITING_PLAN_LIST': apiHost + '/phone/plan/getVisitingPlanList.action',
		//'SUBMIT_VISITING_PLAN': '../../services/mock/submitVisitingPlan.json',
		'SUBMIT_VISITING_PLAN': apiHost + '/phone/plan/submitVisitingPlan.action',
		//'GET_VISITING_PLAN_DETAIL': '../../services/mock/getVisitingPlanDetail.json',
		'GET_VISITING_PLAN_DETAIL': apiHost + '/phone/plan/getVisitingPlanDetail.action',
		//'SUBMIT_VISITING_PLAN_COMMENT': '../../services/mock/submitVisitingPlanComment.json',
		'SUBMIT_VISITING_PLAN_COMMENT': apiHost + '/phone/plan/submitVisitingPlanComment.action',

		/* 许可证相关 */
		//'GET_LICENCE_WARNING_LIST': '../../services/mock/getLicenceWarningList.json',
		'GET_LICENCE_WARNING_LIST': apiHost + '/phone/license/getLicenceWarningList.action',
		//'SEND_LICENCE_WARNING_MESSAGE': '../../services/mock/sendLicenceWarningMessage.json'
		'SEND_LICENCE_WARNING_MESSAGE': apiHost + '/phone/license/sendLicenceWarningMessage.action',

		/* 采集相关 */
		//'LIST_ENDPOINT': '../../services/mock/listEndpoint.json',
		'LIST_ENDPOINT': apiHost + '/phone/end/list.action',
		//'LIST_COLLECT_INFO': '../../services/mock/listCollectInfo.json',
		'LIST_COLLECT_INFO': apiHost + '/phone/info/list.action',
		'LIST_COLLECT_INFO_SUBMIT': apiHost + '/phone/info/submit.action'
	}
}
