import React, { Component } from 'react';
import { Image, TouchableHighlight, Animated } from 'react-native';
import { Left, Right, Text, View, Icon, Body } from 'native-base';
import styles from './HistoryItemStyle';
/* eslint-disable global-require */

class HistoryItem extends Component {
    constructor(props) {
        super(props);

        this.icons = {   
            up: 'md-arrow-dropup',
            down: 'md-arrow-dropdown'
        };

        this.state = {       
            expanded: true,
            showBody: false
        };
    }
    // change icon after clicking
    toggle = () => {
        if (this.state.expanded) {
            this.setState({ expanded: false, showBody: true });
        } else {
            this.setState({ expanded: true, showBody: false });
        }
    }

    render() {
        let icon = this.icons.down;

        if (this.state.expanded) {
            icon = this.icons.up;   
        }

        let specificStatus;
        switch (this.props.status) {
            case 0: { specificStatus = 'Canceled'; break; }
            case 1: { specificStatus = 'Waiting'; break; }
            case 2: { specificStatus = 'Picked up'; break; }
            case 3: { specificStatus = 'Delivering'; break; }
            case 4: { specificStatus = 'Completed'; break; }
            default: break;
        }

        return ( 
            <Animated.View
                 style={[styles.container, { flexWrap: 'wrap' }]}
            >
                    <View style={styles.titleContainer} >
                        <Left style={{ flex: 1.5, backgroundColor: '#ff5a3e' }}>
                            <Text style={[styles.title, { color: '#fff', textAlign: 'center', fontSize: 14 }]}>{specificStatus}</Text>
                        </Left>
                        <Body style={{ flex: 3 }}>
                            <Text style={[styles.title, { fontWeight: 'normal' }]}>{this.props.created_at}</Text>
                        </Body>
                        <Right>
                            <TouchableHighlight 
                                style={styles.button} 
                                onPress={() => this.toggle()}
                                underlayColor="#f1f1f1"
                            >
                                <Icon name={icon} />
                            </TouchableHighlight>
                        </Right>
                    </View>
                    {
                        (this.state.showBody) &&
                        <View style={styles.body} >
                            <View style={styles.locationViewStyle} >
                                <Image 
                                    source={require('../image/placeholder.png')}
                                    style={styles.iconStyle}
                                />
                                <View style={{ flexWrap: 'wrap', flex: 1 }}>
                                    <Text style={styles.addressStyle} >{this.props.pickup_location_address}</Text>
                                </View>
                            </View>
                            <View style={styles.locationViewStyle} >
                                <Image 
                                    source={require('../image/destination.png')}
                                    style={styles.iconStyle}
                                />
                                <View style={{ flexWrap: 'wrap', flex: 1 }}>
                                    <Text style={styles.addressStyle} >{this.props.destination_address}</Text>
                                </View>
                            </View>
                            <View style={[styles.statusStyle, { marginTop: 5 }]} />
                            <View style={styles.locationViewStyle}>
                                <Left>
                                    <Text style={styles.addressStyle}>Total: </Text>
                                </Left>
                                <Right>
                                    <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{this.props.price} VND</Text>
                                </Right>
                            </View>
                        </View>
                    }
            </Animated.View>
            
        );
    }
}
export default HistoryItem;
