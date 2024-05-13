export enum QueryKeys {
  messages = 'messages',
  allConversations = 'allConversations',
  archivedConversations = 'archivedConversations',
  conversations = 'conversations', //delete this?
  searchConversations = 'searchConversations',
  conversation = 'conversation',
  searchEnabled = 'searchEnabled',
  user = 'user',
  name = 'name', // user key name
  models = 'models',
  balance = 'balance',
  endpoints = 'endpoints',
  presets = 'presets',
  searchResults = 'searchResults',
  tokenCount = 'tokenCount',
  availablePlugins = 'availablePlugins',
  startupConfig = 'startupConfig',
  assistants = 'assistants',
  assistant = 'assistant',
  endpointsConfigOverride = 'endpointsConfigOverride',
  files = 'files',
  fileConfig = 'fileConfig',
  tools = 'tools',
  actions = 'actions',
  assistantDocs = 'assistantDocs',
  fileDownload = 'fileDownload',
}

export enum MutationKeys {
  fileUpload = 'fileUpload',
  fileDelete = 'fileDelete',
  updatePreset = 'updatePreset',
  deletePreset = 'deletePreset',
  logoutUser = 'logoutUser',
  avatarUpload = 'avatarUpload',
  assistantAvatarUpload = 'assistantAvatarUpload',
  updateAction = 'updateAction',
  deleteAction = 'deleteAction',
}
