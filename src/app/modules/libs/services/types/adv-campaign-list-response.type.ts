import { 
  AdvCampaignAutopilotStrategyType,
  AdvCampaignAutopilotType,
  AdvCampaignModeType,
  AdvCampaignPaymentType,
  AdvCampaignPlacementType
} from 'src/app/models/ozon/adv-campaign'
import { AdvCampaignStateType, AdvCampaignType } from './api-payload.type'

type AdvCampaignListItemType = {
  id: string,
  PaymentType: AdvCampaignPaymentType,
  title: string,
  state: AdvCampaignStateType,
  advObjectType: AdvCampaignType,
  fromDate: Date,
  toDate: Date,
  budget: string,
  dailyBudget: string,
  weeklyBudget: string,
  placement: AdvCampaignPlacementType[],
  productAutopilotStrategy: AdvCampaignAutopilotStrategyType,
  autopilot: AdvCampaignAutopilotType,
  createdAt: Date,
  updatedAt: Date,
  productCampaignMode: AdvCampaignModeType,
}

export type AdvCampaignListResponseType = {
  list: AdvCampaignListItemType[],
  total: string
}