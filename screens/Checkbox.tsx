import { Pressable, View } from 'react-native';

const CheckBox = ({
  isChecked,
  onPress,
}: {
  isChecked: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View
          style={{
            height: 20,
            width: 20,
            borderRadius: 4,
            borderWidth: 2,
            borderColor: '#000',
            backgroundColor: isChecked ? '#000' : '#fff',
          }}
        />
      </View>
    </Pressable>
  );
};

export default CheckBox;
