// Set Debug Mode
User u = [SELECT ID FROM User WHERE Id = :UserInfo.getUserId()];
u.UserPreferencesUserDebugModePref = true;
update u;