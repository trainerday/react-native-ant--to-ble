import React, {FC, useState} from 'react'
import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import AntPlus, {
  AntPlusDevice,
  AntPlusFitnessEquipmentRequest,
  AntPlusFitnessEquipmentType,
} from 'react-native-ant-plus'
import connect from './functions/connect'
import disconnect from './functions/disconnect'

const Device: FC<AntPlusDevice> = device => {
  const [isConnected, setConnected] = useState(false)
  const [isWaiting, setWaiting] = useState(false)
  const [isFec, setFec] = useState(false)

  const onConnect = async () => {
    setWaiting(true)
    const result = await connect(device)
    setConnected(!!result?.connected)
    setFec(result?.type === AntPlusFitnessEquipmentType.TRAINER || result?.type === AntPlusFitnessEquipmentType.BIKE)
    setWaiting(false)

    console.log(result, 'Connected ------')
    if (result?.connected) {
      console.log('Get capabilities ------')
      const data = await AntPlus.request(device.antDeviceNumber, AntPlusFitnessEquipmentRequest.Capabilities, {})
      console.log(data, 'Capabilities ------')
    }
  }

  const onDisconnect = async () => {
    setWaiting(true)
    await disconnect(device.antDeviceNumber)
    setConnected(false)
    setWaiting(false)
  }

  const CommandStatus = async () => {
    console.log('CommandStatus')
    const result = await AntPlus.request(device.antDeviceNumber, AntPlusFitnessEquipmentRequest.CommandStatus, {})
    console.log('CommandStatus', result)
  }

  const onChangeTarget = async () => {
    const args = {target: 100}
    const result = await AntPlus.request(device.antDeviceNumber, AntPlusFitnessEquipmentRequest.SetTargetPower, args)
    console.log('onChangeTarget', result)
  }

  const onChangeResistance = async () => {
    const args = {totalResistance: 15}
    const result = await AntPlus.request(device.antDeviceNumber, AntPlusFitnessEquipmentRequest.SetBasicResistance, args)
    console.log('onChangeResistance', result)
  }

  const onChangeSlope = async () => {
    const args = {grade: 2, rollingResistanceCoefficient: 0.0022}
    const result = await AntPlus.request(device.antDeviceNumber, AntPlusFitnessEquipmentRequest.SetTrackResistance, args)
    console.log('onChangeSlope', result)
  }


  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <View>
          <Text>Type: {device.antPlusDeviceTypeName}</Text>
          <Text>DisplayName: {device.deviceDisplayName}</Text>
          <Text>Status: {isWaiting ? 'connecting...' : isConnected ? 'connected' : 'disconnected'}</Text>
        </View>
        {!isWaiting ? (
          <TouchableOpacity onPress={isConnected ? onDisconnect : onConnect} style={styles.button}>
            <Text>{isConnected ? 'Disconnect' : 'Connect'}</Text>
          </TouchableOpacity>
        ) : <ActivityIndicator size="large" color="#000"/>}
      </View>
      {isFec && (
        <>
          <Text>Change target:</Text>
          <View style={styles.controls}>
            <TouchableOpacity onPress={onChangeTarget} style={styles.button}>
              <Text>target 100</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onChangeResistance} style={styles.button}>
              <Text>resistance 15%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onChangeSlope} style={styles.button}>
              <Text>slope 2%</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={CommandStatus} style={styles.button}>
              <Text>CommandStatus</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#efefef',
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controls: {
    justifyContent: 'space-around',
    flexDirection: 'row',
  },
  button: {
    borderWidth: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
  },
})

export default Device
