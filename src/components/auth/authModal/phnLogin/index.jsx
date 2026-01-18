{/*'use client';
import Breadcrumb from '@/Components/Common/Breadcrumb';
import WrapperComponent from '@/Components/Common/WrapperComponent';
import ShowBox from '@/elements/alerts&Modals/ShowBox';
import SettingContext from '@/Helper/SettingContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useTranslation } from "react-i18next";
import { Col } from 'reactstrap';
import loginImage from '../../../../public/assets/images/inner-page/log-in.png';
import AuthHeadings from '../Common/AuthHeadings';
import LoginForm from './LoginForm';
import useHandlePhnLogin from '@/utils/hooks/usePhnLogin';

const LoginContent = () => {
  const { t } = useTranslation('common');
  const [showBoxMessage, setShowBoxMessage] = useState();
  const { mutate, isLoading } = useHandlePhnLogin(setShowBoxMessage);
  const { settingData } = useContext(SettingContext);

  return (
    <>
      <Breadcrumb title={'Login'} subNavigation={[{ name: 'Login' }]} />
      <WrapperComponent classes={{ sectionClass: 'log-in-section background-image-2 section-b-space', fluidClass: 'w-100' }} customCol={true}>
        <Col xxl={6} xl={5} lg={6} className='d-lg-block d-none ms-auto'>
          <div className='image-contain'>
            {loginImage && <Image src={loginImage} className='img-fluid' alt='loginImage' height={465} width={550} />}
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className='mx-auto'>
            <ShowBox showBoxMessage={showBoxMessage} />
          <div className='log-in-box'>
            <AuthHeadings heading1={`Welcome to ${settingData?.general?.site_name}`} heading2={'LogInYourAccount'} />
            <div className='input-box mb-2'>
              <LoginForm  mutate={mutate} isLoading={isLoading}/>
            </div>
            <div className='other-log-in'>
              <h6>{t('or')}</h6>
            </div>

            <div className='sign-up-box'>
              <h4>{t("Don'thaveanaccount")}?</h4>
              <Link href={`/auth/register`}>{t('SignUp')}</Link>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default LoginContent;*/}

/**
 * LoginContent Component
 * 
 * Main login page container handling phone OTP and email authentication flows.
 * Manages state transitions between phone entry, OTP verification, and email login.
 * 
 * Key Features:
 * - Dynamic state management for auth flows: phone login, OTP verification, email login
 * - Conditional rendering based on authentication state
 * - Cookie cleanup for OTP flow navigation
 * - Responsive layout with image on larger screens
 * - Integration with site-wide setting context
 * - Breadcrumb navigation reflecting current auth state
 * - Back navigation between authentication methods
 * 
 * @returns {JSX.Element} Main authentication page with flow management
 * 
 * @developer Simran Samir
 * @version 1.0
 */

'use client';
import Breadcrumb from '@/Components/Common/Breadcrumb';
import WrapperComponent from '@/Components/Common/WrapperComponent';
import ShowBox from '@/elements/alerts&Modals/ShowBox';
import SettingContext from '@/Helper/SettingContext';
import Image from 'next/image';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Col } from 'reactstrap';
import loginImage from '../../../../public/assets/images/inner-page/log-in.png';
import AuthHeadings from '../Common/AuthHeadings';
import LoginForm from './LoginForm';
import OTPVerificationForm from '../OTPVerificationForm';

const LoginContent = () => {
  const { t } = useTranslation('common');
  const [showBoxMessage, setShowBoxMessage] = useState();
  const [authState, setAuthState] = useState('phnLogin'); // 'phnLogin', 'otp', or 'login'
  const { settingData } = useContext(SettingContext);

  // Debug state changes
  useEffect(() => {
    console.log("DEBUG: authState changed to:", authState);
  }, [authState]);

  // Clear OTP cookies when going back to phone login
  const handleBackToPhoneLogin = () => {
    // Clear phone cookies
    document.cookie = "up=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "uc=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setAuthState('phnLogin');
  };

  // Handle back to email login
  const handleBackToEmailLogin = () => {
    setAuthState('login');
  };

  return (
    <>
      <Breadcrumb 
        title={authState === 'phnLogin' ? 'Phone Login' : authState === 'otp' ? 'Verify OTP' : 'Login'} 
        subNavigation={[{ name: authState === 'phnLogin' ? 'Phone Login' : authState === 'otp' ? 'Verify OTP' : 'Login' }]} 
      />
      <WrapperComponent classes={{ sectionClass: 'log-in-section background-image-2 section-b-space', fluidClass: 'w-100' }} customCol={true}>
        <Col xxl={6} xl={5} lg={6} className='d-lg-block d-none ms-auto'>
          <div className='image-contain'>
            {loginImage && <Image src={loginImage} className='img-fluid' alt='loginImage' height={465} width={550} />}
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className='mx-auto'>
          <ShowBox showBoxMessage={showBoxMessage} />
          <div className='log-in-box'>
            <AuthHeadings 
              heading1={`Welcome to ${settingData?.general?.site_name}`} 
              heading2={
                authState === 'phnLogin' ? 'Login with Phone' : 
                authState === 'otp' ? 'Verify OTP' : 
                'LogInYourAccount'
              } 
            />
            
            <div className='input-box mb-2'>
              {authState === 'phnLogin' ? (
                <LoginForm 
                  setState={setAuthState}
                  setShowBoxMessage={setShowBoxMessage}
                />
              ) : authState === 'otp' ? (
                <OTPVerificationForm 
                  setState={setAuthState}
                  setShowBoxMessage={setShowBoxMessage}
                  onBackToPhoneLogin={handleBackToPhoneLogin}
                />
              ) : (
                // This should render your email login form
                // You need to import and use your email login form here
                <div className="text-center">
                  <p>Redirecting to email login...</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/auth/login'}
                  >
                    Go to Email Login
                  </button>
                </div>
              )}
            </div>
            
            {/* Only show "OR" and "Don't have account" on phone login page */}
            {authState === 'phnLogin' && (
              <>
                <div className='other-log-in'>
                  <h6>{t('or')}</h6>
                </div>
                <div className='sign-up-box'>
                  <h4>{t("Don'thaveanaccount")}?</h4>
                  <Link href={`/auth/register`}>{t('SignUp')}</Link>
                </div>
              </>
            )}
            
            {/* Show back button only on OTP page */}
            {authState === 'otp' && (
              <div className='sign-up-box text-center mt-3'>
                <button 
                  className="btn btn-link" 
                  onClick={handleBackToPhoneLogin}
                >
                  <i className="ri-arrow-left-line me-2"></i>
                  Change Mobile Number
                </button>
              </div>
            )}
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default LoginContent;
