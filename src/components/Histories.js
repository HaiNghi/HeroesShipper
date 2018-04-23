import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, List, ListItem, Text, Content, View, Left, Right } from 'native-base';
import PercentageCircle from 'react-native-percentage-circle';
import { HeaderBase } from './common';
import HistoryItem from './HistoryItem';
import { HistoryStyle } from './styles';

class Histories extends Component {
    componentDidMount() {
        this.props.getHistoryList();
        this.props.getOutCome();
    }

    render() {
        let earnings = '0';
        let percentage = 0;
        if (this.props.outCome !== '0' && this.props.outCome !== '') { earnings = this.props.outCome; percentage = earnings / 1000; }
        return (
            <Container>
                <HeaderBase headerText='History' navigation={this.props.navigation} />
                <Content>
                    <View style={HistoryStyle.container}>
                        <Text style={HistoryStyle.title}>You have earned a total of {earnings} VND today</Text>
                        <PercentageCircle 
                                radius={60} 
                                percent={percentage} 
                                color='#ff5a3e' 
                                style={HistoryStyle.container}
                                borderWidth={7}
                        >
                            <Text style={{ fontWeight: 'bold' }}>{earnings}</Text>
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
