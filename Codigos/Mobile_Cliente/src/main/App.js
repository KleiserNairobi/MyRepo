/**
 * Main Controller
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Icon } from 'native-base';
import { NotificationAlert } from '../components/general/alerts';
import Styles from '../assets/scss/styles';

// Pages List
import LoginPage from '../pages/login/login';
import RegisterPage from '../pages/register/register';
import RegisterPfPage from '../pages/register/registerPF';
import RegisterPjPage from '../pages/register/registerPJ';
import RegisterAddressPage from '../pages/register/registerAddress';
import RegisterMarketSegmentPage from '../pages/register/registerMarketSegment';
import RegisterPasswordPage from '../pages/register/registerPassword';
import RegisterTermsPage from '../pages/register/registerTerms';
import RegisterFinishedPage from '../pages/register/registerFinished';
import MenuPage from '../pages/menu/menu';
import SolicitationPage from '../pages/solicitation/solicitation';
import ChoosePickupAddressPage from '../pages/solicitation/choosePickupAddress';
import InsertPickupAddressPage from '../pages/solicitation/insertPickupAddress';
import ListFavoritePickupAddressPage from '../pages/solicitation/listFavoritePickupAddress';
import GPSPickupAddressPage from '../pages/solicitation/GPSPickupAddress';
import InstructionsPickupAddressPage from '../pages/solicitation/instructionsPickupAddress';
import ChooseDeliveryAddressPage from '../pages/solicitation/chooseDeliveryAddress';
import InsertDeliveryAddressPage from '../pages/solicitation/insertDeliveryAddress';
import ListFavoriteDeliveryAddressPage from '../pages/solicitation/listFavoriteDeliveryAddress';
import GPSDeliveryAddressPage from '../pages/solicitation/GPSDeliveryAddress';
import InstructionsDeliveryAddressPage from '../pages/solicitation/instructionsDeliveryAddress';
import ConfirmationSolicitationPage from '../pages/solicitation/confirmationSolicitation';
import ChooseSchedulePage from '../pages/schedule/chooseSchedule';
import ScheduleDeliverymanPage from '../pages/schedule/scheduleDeliveryman';
import RegisterSchedulePage from '../pages/schedule/registerSchedule';
import FinalizedSchedulePage from '../pages/schedule/finalizedSchedule';
import RegisterDeliveryPage from '../pages/delivery/registerDelivery';
import InsertDeliveryExtraDataPage from '../pages/payment/insertDeliveryExtraData';
import RegisterPaymentPage from '../pages/payment/registerPayment';
import ChooseCardGatewayPage from '../pages/payment/chooseCardGateway';
import InsertCardDataPage from '../pages/payment/insertCardData';
import FindDeliverymanPage from '../pages/deliveryman/findDeliveryman';
import FinalizedSolicitationPage from '../pages/solicitation/finalizedSolicitation';
import AccountPage from '../pages/account/account';
import EditPerfilPage from '../pages/account/editPerfil';
import ConfigurationsPage from '../pages/configuration/configurations';
import SchedulesPage from '../pages/schedule/schedules';
import ScheduleDetailsPage from '../pages/schedule/scheduleDetails';
import DeliveriesPage from '../pages/delivery/deliveries';
import DeliveryDetailsPage from '../pages/delivery/deliveryDetails';
import RegisterRatingPage from '../pages/rating/registerRating';
import FinancialTransactionsPage from '../pages/financial/financialTransactions';
import ContactsPage from '../pages/contact/contacts';
import ChatSupportPage from '../pages/chat/chatSupport';

// Navigations
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Solicitation Pages Navigation
const solicitationPages = () => (
  <Stack.Navigator
    initialRouteName="Solicitation"
    screenOptions={{
      headerStyle: Styles.header,
      headerTitleStyle: Styles.headerTitle,
      headerTitleAlign: 'center'
    }}>
    <Stack.Screen
      name="Solicitation"
      component={SolicitationPage}
      options={{
        title: 'Nova Solicitação'
      }} />
    <Stack.Screen
      name="ChoosePickupAddress"
      component={ChoosePickupAddressPage}
      options={{
        title: 'Endereço de Retirada'
      }} />
    <Stack.Screen
      name="InsertPickupAddress"
      component={InsertPickupAddressPage}
      options={{
        title: 'Local de Retirada'
      }} />
    <Stack.Screen
      name="ListFavoritePickupAddress"
      component={ListFavoritePickupAddressPage}
      options={{
        title: 'Lista de Favoritos'
      }} />
    <Stack.Screen
      name="GPSPickupAddress"
      component={GPSPickupAddressPage}
      options={{
        title: 'Localização Atual'
      }} />
    <Stack.Screen
      name="InstructionsPickupAddress"
      component={InstructionsPickupAddressPage}
      options={{
        title: 'Instruçōes de Retirada'
      }} />
    <Stack.Screen
      name="ChooseDeliveryAddress"
      component={ChooseDeliveryAddressPage}
      options={{
        title: 'Endereço de Entrega'
      }} />
    <Stack.Screen
      name="InsertDeliveryAddress"
      component={InsertDeliveryAddressPage}
      options={{
        title: 'Local de Entrega'
      }} />
    <Stack.Screen
      name="ListFavoriteDeliveryAddress"
      component={ListFavoriteDeliveryAddressPage}
      options={{
        title: 'Lista de Favoritos'
      }} />
    <Stack.Screen
      name="GPSDeliveryAddress"
      component={GPSDeliveryAddressPage}
      options={{
        title: 'Localização Atual'
      }} />
    <Stack.Screen
      name="InstructionsDeliveryAddress"
      component={InstructionsDeliveryAddressPage}
      options={{
        title: 'Instruçōes de Entrega'
      }} />
    <Stack.Screen
      name="ConfirmationSolicitation"
      component={ConfirmationSolicitationPage}
      options={{
        title: 'Confirmação'
      }} />
    <Stack.Screen
      name="ChooseSchedule"
      component={ChooseSchedulePage}
      options={{
        title: 'Agendamento'
      }} />
    <Stack.Screen
      name="RegisterSchedule"
      component={RegisterSchedulePage}
      options={{
        title: 'Registrar Agendamento'
      }} />
    <Stack.Screen
      name="FinalizedSchedule"
      component={FinalizedSchedulePage}
      options={{
        title: 'Agendamento Registrado'
      }} />
    <Stack.Screen
      name="RegisterDelivery"
      component={RegisterDeliveryPage}
      options={{
        title: 'Registrar Entrega'
      }} />
    <Stack.Screen
      name="InsertDeliveryExtraData"
      component={InsertDeliveryExtraDataPage}
      options={{
        title: 'Informações Extras'
      }} />
    <Stack.Screen
      name="RegisterPayment"
      component={RegisterPaymentPage}
      options={{
        title: 'Registrar pagamento'
      }} />
    <Stack.Screen
      name="ChooseCardGateway"
      component={ChooseCardGatewayPage}
      options={{
        title: 'Gateways de Pagamento'
      }} />
    <Stack.Screen
      name="InsertCardData"
      component={InsertCardDataPage}
      options={{
        title: 'Dados do Cartão'
      }} />
    <Stack.Screen
      name="FindDeliveryman"
      component={FindDeliverymanPage}
      options={{
        title: 'Entregador'
      }} />
    <Stack.Screen
      name="ScheduleDeliveryman"
      component={ScheduleDeliverymanPage}
      options={{
        title: 'Lista de Entregadores'
      }} />
    <Stack.Screen
      name="FinalizedSolicitation"
      component={FinalizedSolicitationPage}
      options={{
        title: 'Concluída'
      }} />
    <Stack.Screen
      name="Configurations"
      component={ConfigurationsPage}
      options={{
        title: 'Configuraçōes'
      }} />
    <Stack.Screen
      name="Schedules"
      component={SchedulesPage}
      options={{
        title: 'Agendamentos'
      }} />
    <Stack.Screen
      name="ScheduleDetails"
      component={ScheduleDetailsPage}
      options={{
        title: 'Detalhes'
      }} />
    <Stack.Screen
      name="Deliveries"
      component={DeliveriesPage}
      options={{
        title: 'Histórico de Solicitaçōes'
      }} />
    <Stack.Screen
      name="DeliveryDetails"
      component={DeliveryDetailsPage}
      options={{
        title: 'Detalhes'
      }} />
    <Stack.Screen
      name="RegisterRating"
      component={RegisterRatingPage}
      options={{
        title: 'Avaliação'
      }} />
    <Stack.Screen
      name="FinancialTransactions"
      component={FinancialTransactionsPage}
      options={{
        title: 'Movimentações Financeiras'
      }} />
    <Stack.Screen
      name="EditPerfil"
      component={EditPerfilPage}
      options={{
        title: 'Perfil'
      }} />
    <Stack.Screen
      name="Contacts"
      component={ContactsPage}
      options={{
        title: 'Fale conosco'
      }} />
    <Stack.Screen
      name="ChatSupport"
      component={ChatSupportPage}
      options={{
        title: 'Suporte'
      }} />
  </Stack.Navigator>
);

// Tabs Navigation
const tabsPages = () => (
  <Tab.Navigator
    initialRouteName="SolicitationPages"
    tabBarOptions={{
      activeTintColor: '#FFCC00',
      inactiveTintColor: '#FFFFFF',
      tabStyle: Styles.tabBarBottom,
      style: { height: 74 },
      labelStyle: Styles.tabBarBottomText,
      keyboardHidesTabBar: true
    }}
  >
    <Tab.Screen
      name="Menu"
      component={MenuPage}
      options={{
        tabBarLabel: 'Menu',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="menu"
            color={color}
            size={32} />
        )
      }}
    />
    <Tab.Screen
      name="SolicitationPages"
      component={solicitationPages}
      options={{
        tabBarLabel: 'Solicitação',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="map-marker-radius"
            color={color}
            size={32} />
        )
      }}
    />
    <Tab.Screen
      name="Account"
      component={AccountPage}
      options={{
        tabBarLabel: 'Conta',
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons
            name="tooltip-account"
            color={color}
            size={32} />
        )
      }}
    />
  </Tab.Navigator>
);

// Main Navigation
const mainNavigation = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="default" backgroundColor={Styles.body.backgroundColor} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen
          name="Login"
          component={LoginPage} />
        <Stack.Screen
          name="Register"
          component={RegisterPage} />
        <Stack.Screen
          name="RegisterPF"
          component={RegisterPfPage} />
        <Stack.Screen
          name="RegisterPJ"
          component={RegisterPjPage} />
        <Stack.Screen
          name="RegisterAddress"
          component={RegisterAddressPage} />
        <Stack.Screen
          name="RegisterMarketSegment"
          component={RegisterMarketSegmentPage} />
        <Stack.Screen
          name="RegisterPassword"
          component={RegisterPasswordPage} />
        <Stack.Screen
          name="RegisterTerms"
          component={RegisterTermsPage} />
        <Stack.Screen
          name="RegisterFinished"
          component={RegisterFinishedPage} />
        <Stack.Screen
          name="InternalApp"
          component={tabsPages} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default mainNavigation;