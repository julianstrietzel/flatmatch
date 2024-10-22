import AccountSettingsInfo from "../accountSettings/AccountSettingsInfo.tsx";

export const FlatDetailsMessages = () => {
  const messages = [
    "Highlighting Pet-Friendly Areas in your listing caters to the growing number of pet owners looking for suitable accommodations.",
    "This tag can increase your property's attractiveness to this demographic, potentially enhancing match chances.",
    "Go to your Account Settings to add an account image.",
  ];

  return <AccountSettingsInfo messages={messages} />;
};
