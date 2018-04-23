import React, { Component } from 'react';
import { Text, Keyboard, Alert } from 'react-native';
import { View, InputGroup, Input, Icon, Button, CheckBox } from 'native-base';
import styles from './SearchBoxStyles';

class SearchBox extends Component {
    constructor(props) {
        super(props);
        this.state = { check: false, disabled: true };
    }

    componentWillReceiveProps(nextProps) {
        (nextProps.isExisted) ? this.setState({ disabled: false }) : this.setState({ disabled: true });
    }
    
    onCheck = () => {
        this.props.haveFinalDestination();
    }
    handleGetDropOff = (text) => {
        const { region } = this.props;
        this.props.getDropOff(text);
        this.props.getAddressPredictions(text, { region });
    }
    deleteAddress = (text) => {
        this.props.deleteResultAddress(text);
        Keyboard.dismiss();
    }

    render() {
        return (
            <View style={styles.searchBox}>
                <View style={styles.inputWrapper}>
                    <Text style={styles.label}>FINAL DESTINATION</Text>
                    <InputGroup>
                        {/* <Button transparent>
                            <Icon name="search" size={15} color="#ff5e3a" />  
                        </Button> */}
                        <CheckBox style={{ marginRight: 20 }} checked={this.props.isExisted} onPress={() => this.onCheck()} />
    
                        <Input 
                            disabled={this.state.disabled}
                            style={styles.inputSearch} placeholder="Choose destination location" 
                            onChangeText={
                                (text) => this.handleGetDropOff(text)
                            }
                            value={this.props.dropOff}
                        />
                        {
                            (this.props.dropOff !== '' && this.props.isExisted) &&
                            <Button transparent onPress={() => this.deleteAddress('dropOff')} accessible={false}>
                                <Icon name="md-close" size={15} color="#ff5e3a" />
                            </Button>
                        }
                        
                    </InputGroup>
                </View>
                
            </View>
        );
    }
}

export default SearchBox;
