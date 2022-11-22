import AntPlus, {
  AntPlusBikeCadenceEvent,
  AntPlusBikePowerEvent,
  AntPlusDevice,
  AntPlusDeviceType,
  AntPlusFitnessEquipmentEvent,
  AntPlusHeartRateEvent,
  AntPlusSpeedDistanceEvent
} from 'react-native-ant-plus'

export default async (device: AntPlusDevice) => {
  let isConnected = false
  try {
    isConnected = (await AntPlus.isConnected(device.antDeviceNumber, device.antPlusDeviceType)) || false
    if (!isConnected) {
      const result = await AntPlus.connect(device.antDeviceNumber, device.antPlusDeviceType)
      isConnected = result.connected
      if (!result.connected) return isConnected
    }

    switch (device.antPlusDeviceType) {
      case AntPlusDeviceType.BIKE_CADENCE:
        AntPlus.subscribe(device.antDeviceNumber, device.antPlusDeviceType, [AntPlusBikeCadenceEvent.CalculatedCadence], true)
        break
      case AntPlusDeviceType.BIKE_POWER:
        AntPlus.subscribe(device.antDeviceNumber, device.antPlusDeviceType, [AntPlusBikePowerEvent.CalculatedPower], true)
        break
      case AntPlusDeviceType.FITNESS_EQUIPMENT:
        AntPlus.subscribe(
          device.antDeviceNumber,
          device.antPlusDeviceType,
          [AntPlusFitnessEquipmentEvent.CalculatedTrainerPower, AntPlusFitnessEquipmentEvent.Capabilities],
          true
        )
        break
      case AntPlusDeviceType.HEARTRATE:
        AntPlus.subscribe(device.antDeviceNumber, device.antPlusDeviceType, [AntPlusHeartRateEvent.HeartRateData], true)
        break
      case AntPlusDeviceType.BIKE_SPD:
        AntPlus.subscribe(device.antDeviceNumber, device.antPlusDeviceType, [AntPlusSpeedDistanceEvent.CalculatedSpeed], true)
        break
    }
  } catch (error) {
    console.log('connect error', error)
  }
  return isConnected
}
