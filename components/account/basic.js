import * as React from "react";
import {NativeBaseProvider, Input, Stack, FormControl, Radio, Select, CheckIcon} from "native-base";
import {View, Text} from "react-native";
import Counties from "./counties";

export default function BasicInfo(props){
    const [county, setCounty] = React.useState("");
    return (
        <NativeBaseProvider>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', backgroundColor: props.bg}}>
        <Stack space={4} w="50%">
        <FormControl style={{marginRight: 5,}} >
            <FormControl.Label ><Text style={{color: props.color}} >First Name</Text></FormControl.Label>
            <Input variant="outline" size="sm" color={props.color} />
        </FormControl>
        </Stack>
        <Stack space={4} w="50%">
        <FormControl style={{marginLeft: 5,}} >
            <FormControl.Label ><Text style={{color: props.color}} >Last Name</Text></FormControl.Label>
            <Input variant="outline"  size="sm" color={props.color} />
        </FormControl>
        </Stack>
        </View>
        <FormControl style={{marginLeft: 5, marginTop: 10,}}  >
        <FormControl.Label ><Text style={{color: props.color}} >County of Residence</Text></FormControl.Label>
    <Select color={props.color} backgroundColor={props.bg} selectedValue={county} minWidth="200" accessibilityLabel="County of Residence" placeholder="County of Residence" _selectedItem={{
        bg: "teal.600",
        endIcon: <CheckIcon size="5" />
      }} mt={1} onValueChange={itemValue => setCounty(itemValue)}>
          {Counties.map((data) => {
              return (
                <Select.Item key={data.id} color={props.color} label={data.text} value={data.text} />
              )
          })}
        </Select>
    </FormControl>
        <FormControl style={{marginLeft: 5, marginTop: 10,}} >
        <FormControl.Label ><Text style={{color: props.color}} >Select your gender</Text></FormControl.Label>
        <Radio.Group defaultValue="1" name="myRadioGroup" accessibilityLabel="Gender:">
      <Radio value="1" my={1}>
        Male
      </Radio>
      <Radio value="2" my={1}>
        Female
      </Radio>
    </Radio.Group>
    </FormControl>
        </NativeBaseProvider>
    )
}