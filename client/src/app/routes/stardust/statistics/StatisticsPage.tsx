import moment from "moment";
import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { ServiceFactory } from "../../../../factories/serviceFactory";
import { STARDUST } from "../../../../models/config/protocolVersion";
import { StardustApiClient } from "../../../../services/stardust/stardustApiClient";
import StackedBarChart from "../../../components/stardust/statistics/StackedBarChart";
import "./StatisticsPage.scss";

interface StatisticsPageProps {
    network: string;
}

export interface BlocksDailyView {
    [key: string]: number;
    time: number;
}

const StatisticsPage: React.FC<RouteComponentProps<StatisticsPageProps>> = ({ match: { params: { network } } }) => {
    const [apiClient] = useState(
        ServiceFactory.get<StardustApiClient>(`api-client-${STARDUST}`)
    );
    const [data, setData] = useState<BlocksDailyView[] | null>(null);

    useEffect(() => {
        apiClient.influxAnalytics({ network }).then(response => {
            if (!response.error) {
                console.log("Influx response", response);
                const update: BlocksDailyView[] = response.blocksDaily.map(day => (
                    {
                        time: moment(day.time).add(1, "minute").unix(),
                        transaction: day.transaction ?? 0,
                        milestone: day.milestone ?? 0,
                        taggedData: day.taggedData ?? 0,
                        noPayload: day.noPayload ?? 0
                    }
                ));

                setData(update.slice(-7));
            } else {
                console.log("Fetching statistics failed", response.error);
            }
        }).catch(e => console.log("Influx analytics query failed", e));
    }, []);

    return (
        <div className="statistics-page">
            <div className="wrapper">
                <div className="inner">
                    <div className="statistics-page--header">
                        <div className="row middle">
                            <h1>
                                Statistics
                            </h1>
                        </div>
                    </div>
                    <div className="statistics-page--content">
                        <div className="section">
                            <div className="section--header">
                                <h2>Daily Blocks</h2>
                            </div>
                            {data && (
                                <StackedBarChart
                                    width={1172}
                                    height={550}
                                    subgroups={["transaction", "milestone", "taggedData", "noPayload"]}
                                    colors={["#73bf69", "#f2cc0d", "#8ab8ff", "#ff780a"]}
                                    data={data}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatisticsPage;

