import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { Button } from 'react-native';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const App = () => {
  
  useEffect(()=> {
    GoogleSignin.configure()
  }, [])

  async function onFbLogin() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  // const fblogin = (resCallback) => {
  //   // LoginManager.logOut()
  //   return LoginManager.logInWithPermissions(['email', 'public_profile']).then(
  //     result => {
  //       console.log("FB result ->>>>", result)
  //       if(result.declinedPermissions && result.declinedPermissions.includes("email")) {
  //         resCallback({message: "Email is required"})
  //       }
  //       if(result.isCancelled){
  //         console.log("Error")
  //       }
  //       else {
  //         const infoRequest = new GraphRequest(
  //           '/me?fileds=email,name,picture,friend',
  //           null,
  //           resCallback
  //         )
  //         new GraphRequestManager().addRequest(infoRequest).start()
  //       }
  //     },
  //     function(error){
  //       console.log("Login Failed With Error:", error)
  //     }
  //   )

  // }

  // const onFbLogin = async() => {
  //   try {
  //     await fblogin(_responseInfoCallback)
  //   } catch (error) {
  //     console.log("Error raised:", error)
  //   }
  // }

  // const _responseInfoCallback = async(error, result) => {
  //   if(error){
  //     console.log("error top", error)
  //     return;
  //   }
  //   else{
  //     const userdata = result
  //     console.log("Fb data", userdata)
  //   }

  // }

  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo", userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log("error");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log("error");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log("error");
      } else {
        // some other error happened
        console.log("error");
      }
    }
  };

  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity onPress={googleLogin} style={styles.btnStyle}>
      <Text>
        Google Login
      </Text>
      </TouchableOpacity>

      <Button
      title="Facebook Sign-In"
      style={{...styles.btnStyle, marginTop:16}}
      onPress={() => onFbLogin().then(() => console.log('Signed in with Facebook!'))}
    />
    </View>
  );
};



const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  btnStyle: {
    height: 48,
    paddingHorizontal: 8,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8

  },
});

export default App;
