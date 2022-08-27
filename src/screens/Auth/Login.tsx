import React, {FC, useCallback, useRef, useState} from 'react';
import {Platform, ScrollView, StyleSheet} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import RnPhoneInput from './RnPhoneInput';
import {SubmitHandler, useForm, Resolver, FieldValues} from 'react-hook-form';
import PhoneInput from 'react-native-phone-number-input';
import {useLoginMutation} from '../../RTK/services/login';

const resolver: Resolver<FieldValues> = async values => {
  return {
    values: values.mobile ? values : '',
    errors: !values.mobile
      ? {
          mobile: {
            type: 'required',
            message: 'Phone number is required!',
          },
        }
      : {},
  };
};

const Login: FC = () => {
  const [login] = useLoginMutation();
  const [token, setToken] = useState<string>('');
  const phoneInputRef = useRef<PhoneInput>(null);

  const {control, handleSubmit, setError} = useForm<FieldValues>({
    resolver,
  });

  const onClickSubmit: SubmitHandler<FieldValues> = data => {
    !phoneInputRef?.current?.isValidNumber(data.mobile) &&
      setError('mobile', {type: 'manual', message: 'Invalid phone number'});
    const mobile =
      phoneInputRef?.current?.getNumberAfterPossiblyEliminatingZero();

    login(mobile?.formattedNumber || '')
      .unwrap()
      .then(res => setToken(res.jwt));
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="never"
      contentContainerStyle={{flexGrow: 1}}>
      <Text variant="displayLarge" style={styles.textView}>
        Welcome
      </Text>
      <Card elevation={5} mode={'elevated'} style={styles.phoneContainer}>
        <Text style={styles.title} variant="headlineMedium">
          Your Phone!
        </Text>
        <RnPhoneInput control={control} phoneInputRef={phoneInputRef} />
        <Text style={styles.otpText} variant="labelMedium">
          A 4 digit otp number will be automatically sent to your phone
        </Text>
        <Button
          mode={'contained'}
          style={styles.button}
          onPress={handleSubmit(onClickSubmit)}>
          OK
        </Button>
      </Card>
    </ScrollView>
  );
};
export default Login;

const styles = StyleSheet.create({
  textView: {
    height: '20%',
    margin: 20,
  },
  phoneContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    marginHorizontal: 15,
  },
  title: {
    marginVertical: 25,
    marginLeft: Platform.OS === 'ios' ? 22 : 10,
  },
  otpText: {
    marginHorizontal: 30,
    color: '#BC8F8F',
  },
  button: {
    alignSelf: 'flex-end',
    marginVertical: 20,
    marginRight: 25,
    backgroundColor: '#F08080',
  },
});