import { useState } from "react";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";

// Icons
import { FaApple, FaFacebook, FaGoogle, FaTwitter } from "react-icons/fa";

// Vision UI Dashboard React components
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import GradientBorder from "examples/GradientBorder";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, TwitterAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD_V_S3qwS6VHmLa-XmjQD2eNTd-nPJER8",
  authDomain: "contentguard-auth.firebaseapp.com",
  projectId: "contentguard-auth",
  storageBucket: "contentguard-auth.appspot.com",
  messagingSenderId: "513949078031",
  appId: "1:513949078031:web:9e1dad87ea4de0681e897a",
  measurementId: "G-FBKT88CBPB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Setup Twitter provider and authentication instance
const provider = new TwitterAuthProvider();
const auth = getAuth();

function SignIn() {
  const [rememberMe, setRememberMe] = useState(true);

  // Function to handle Twitter login
  const handleTwitterLogin = () => {
    signInWithRedirect(auth, provider);
  };

  // Handle redirect result when the user returns to the page
  getRedirectResult(auth)
    .then((result) => {
      if (result) {
        // This gives you the Twitter OAuth 1.0 Access Token and Secret
        const credential = TwitterAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const secret = credential.secret;

        // The signed-in user's information
        const user = result.user;
        console.log(`User: ${user.displayName}, Token: ${token}, Secret: ${secret}`);
      }
    })
    .catch((error) => {
      // Handle Errors
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData?.email;
      const credential = TwitterAuthProvider.credentialFromError(error);
      console.error(`Error [${errorCode}]: ${errorMessage}, Email: ${email}, Credential: ${credential}`);
    });

  // Function to toggle the "Remember Me" option
  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <CoverLayout
      title="Welcome!"
      color="white"
      description="Use Twitter to login to your Content Guard Home page to see how we guard your content. In Content Guard Home Page you can see your blockers and blocker reports."
      premotto="GUARDING YOUR CONTENT FOR YOU:"
      motto="CONTENT GUARD"
      cardContent
    >
      <GradientBorder borderRadius="form" minWidth="100%" maxWidth="100%">
        <VuiBox
          component="form"
          role="form"
          borderRadius="inherit"
          p="45px"
          sx={({ palette: { secondary } }) => ({
            backgroundColor: secondary.focus,
          })}
        >
          <VuiTypography
            color="white"
            fontWeight="bold"
            textAlign="center"
            mb="24px"
            sx={({ typography: { size } }) => ({
              fontSize: size.lg,
            })}
          >
            Sign In with Twitter:
          </VuiTypography>
          <Stack mb="25px" justifyContent="center" alignItems="center" direction="row" spacing={2}>
            <GradientBorder borderRadius="xl">
              <IconButton
                transition="all .25s ease"
                justify="center"
                align="center"
                bg="rgb(19,21,54)"
                borderradius="15px"
                sx={({ palette: { secondary }, borders: { borderRadius } }) => ({
                  borderRadius: borderRadius.xl,
                  padding: "25px",
                  backgroundColor: secondary.focus,
                  "&:hover": {
                    backgroundColor: "rgba(secondary.focus, 0.9)",
                  },
                })}
                onClick={handleTwitterLogin} // Trigger Twitter login
              >
                <Icon
                  w="30px"
                  h="30px"
                  sx={({ palette: { white } }) => ({
                    color: white.focus,
                  })}
                />
              </IconButton>
            </GradientBorder>
          </Stack>
        </VuiBox>
      </GradientBorder>
    </CoverLayout>
  );
}

export default SignIn;
