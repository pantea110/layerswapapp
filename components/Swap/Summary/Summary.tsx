import Image from "next/image";
import { ArrowDown, Fuel } from "lucide-react";
import { useAccount } from "wagmi";
import { FC } from "react";
import { Currency } from "../../../Models/Currency";
import { Layer } from "../../../Models/Layer";
import { useSettingsState } from "../../../context/settings";
import { truncateDecimals } from "../../utils/RoundDecimals";
import shortenAddress from "../../utils/ShortenAddress";
import { useQueryState } from "../../../context/query";
import LayerSwapApiClient from "../../../lib/layerSwapApiClient";
import { ApiResponse } from "../../../Models/ApiResponse";
import { Partner } from "../../../Models/Partner";
import useSWR from 'swr'

type SwapInfoProps = {
    currency: Currency,
    source: Layer,
    destination: Layer;
    requestedAmount: number;
    destinationAddress: string;
    refuelAmount?: number;
    fee: number
}

const Summary: FC<SwapInfoProps> = ({ currency, source: from, destination: to, requestedAmount, destinationAddress, refuelAmount, fee }) => {
    const { resolveImgSrc, currencies } = useSettingsState()
    const { isConnected, address } = useAccount();
    const {
        hideFrom,
        hideTo,
        account,
        addressSource,
        hideAddress
    } = useQueryState()

    const layerswapApiClient = new LayerSwapApiClient()
    const { data: partnerData } = useSWR<ApiResponse<Partner>>(addressSource && `/apps?label=${addressSource}`, layerswapApiClient.fetcher)
    const partner = partnerData?.data

    const source = hideFrom ? partner : from
    const destination = hideTo ? partner : to

    const sourceDisplayName = source?.display_name
    const destinationDisplayName = destination?.display_name

    let receive_amount = truncateDecimals(requestedAmount - fee, currency?.precision)

    const requestedAmountInUsd = (currency?.usd_price * requestedAmount).toFixed(2)
    const receiveAmountInUsd = (currency?.usd_price * receive_amount).toFixed(2)
    const nativeCurrency = refuelAmount && to?.isExchange === false && currencies.find(c => c.asset === to?.native_currency)
    const truncatedRefuelAmount = truncateDecimals(refuelAmount, nativeCurrency?.precision)

    const sourceAddress = (hideFrom && account) ? account : (isConnected && !from?.isExchange && address) || undefined
    const destAddress = (hideAddress && hideTo && account) ? account : destinationAddress

    return (
        <div>
            <div className="bg-secondary-700 font-normal rounded-lg flex flex-col border border-secondary-500 w-full relative z-10">
                <div className="flex items-center justify-between w-full px-3 py-2 border-b border-secondary-500">
                    <div className="flex items-center gap-2">
                        <Image src={resolveImgSrc(source)} alt={sourceDisplayName} width={30} height={30} className="rounded-md" />
                        <div>
                            <p className="text-primary-text text-lg leading-5">{sourceDisplayName}</p>
                            {
                                sourceAddress &&
                                <p className="text-sm text-primary-text">{shortenAddress(sourceAddress)}</p>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-white text-lg">{requestedAmount} {currency.asset}</p>
                        <p className="text-primary-text text-sm flex justify-end">${requestedAmountInUsd}</p>
                    </div>
                </div>
                <ArrowDown className="h-4 w-4 text-primary-text absolute top-[calc(50%-8px)] left-[calc(50%-8px)]" />
                <div className="flex items-center justify-between w-full px-3 py-2">
                    <div className="flex items-center gap-2">
                        <Image src={resolveImgSrc(destination)} alt={destinationDisplayName} width={30} height={30} className="rounded-md" />
                        <div>
                            <p className="text-primary-text text-lg leading-5">{destinationDisplayName}</p>
                            <p className="text-sm text-primary-text">{shortenAddress(destAddress)}</p>
                        </div>
                    </div>
                    <div className="flex flex-col justify-end">
                        <p className="text-white text-lg">{receive_amount} {currency.asset}</p>
                        <p className="text-primary-text text-sm flex justify-end">${receiveAmountInUsd}</p>
                    </div>
                </div>
            </div>
            {
                refuelAmount &&
                <div
                    className='w-full flex items-center justify-between rounded-b-lg bg-secondary-700 relative bottom-2 z-[1] pt-4 pb-2 px-3.5 text-right'>
                    <div className='flex items-center gap-2'>
                        <Fuel className='h-4 w-4 text-primary' />
                        <p>Refuel</p>
                    </div>
                    <div className="text-white">
                        + {truncatedRefuelAmount} {nativeCurrency.asset}
                    </div>
                </div>
            }
        </div>
    )
}



export default Summary