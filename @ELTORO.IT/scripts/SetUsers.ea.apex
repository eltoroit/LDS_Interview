// Set Debug Mode
User u = [SELECT ID FROM User WHERE Id = :useringo.getUserId()];
u.UserPreferencesUserDebugModePref: true
update u;