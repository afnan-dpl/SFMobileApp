export const API_ENDPOINTS: Record<string, string> = {
    /// User
  login: "/login",
  workerList: "/users/worker",

  /// Prediction
  predictionList: "/predictions",
  predictionByPageNumber: "/predictions?page=",
  predictionByType: "/predictions/type?type=",
  checkLatestRecordByID: "/predictions/check?id=",

  predictionByUserId : "/predictions/user/",

  latestPrediction: "/predictions/latest",

  predictionByLastDays: "/predictions/last?days=",

    /// activity Summary
    getActivitySummary: "/activity-summary/before?date=",

    getLastPredictionByUser: "/predictions/last-per-user",

    




};