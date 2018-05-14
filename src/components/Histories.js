import React, { Component } from 'react';
import { Container, Text, Content, View, Card } from 'native-base';
import PercentageCircle from 'react-native-percentage-circle';
import { HeaderBase } from './common';
import HistoryItem from './HistoryItem';
import { HistoryStyle } from './styles';

class Histories extends Component {
    constructor(props) {
        super(props);
        this.state = {
            earnings: 0,
            payment: 0
        };
    }
    componentDidMount() {
        this.props.getHistoryList();
        this.props.getOutCome();
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.outCome.daily.total !== '' && nextProps.outCome.weekly.total !== '') {
            this.setState({ earnings: nextProps.outCome.daily.total, payment: nextProps.outCome.weekly.total });
        }
    }

    render() {
        let percentage = 0;
        (this.state.earnings > 100000) ? percentage = 100 : percentage = this.state.earnings / 1000; 
        return (
            <Container>
                <HeaderBase headerText='History' navigation={this.props.navigation} />
                <Content>
                    <View style={HistoryStyle.container}>
                        <Text style={[HistoryStyle.title, { marginBottom: 10 }]}>You have earned a total of {this.state.earnings} VND today</Text>
                        <Text style={HistoryStyle.title}>Do not forget your payment of <Text style={{ fontStyle: 'italic', color: '#ff5a3e' }}>{this.state.payment * 0.15} VND</Text> at the end of this week</Text>
                        <PercentageCircle 
                                radius={60} 
                                percent={percentage} 
                                color='#ff5a3e' 
                                style={HistoryStyle.container}
                                borderWidth={7}
                        >
                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{this.state.earnings} VND today</Text>
                        </PercentageCircle>  
                    </View>
                    <Text style={[HistoryStyle.title, { marginBottom: 10, marginTop: 20 }]}>RECENT HISTORIES</Text>
                        {
                            this.props.historyList.map((item) => {
                                return (
                                    <HistoryItem 
                                        key={item.id}
                                        pickup_location_address={item.pickup_location_address}
                                        destination_address={item.destination_address}
                                        status={item.status}
                                        created_at={item.created_at}
                                        price={item.price}
                                    /> 
                                    
                                );
                            })
                        }
                </Content>
            </Container>
        );
    }
}
export default Histories;
