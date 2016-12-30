 WebLinkController = function($scope, $http, $timeout, DataAccessService, $sce, $filter, $location, Upload, OptionsService, LogService) {
     var self = this;

     self.scope = $scope;
     self.timeout = $timeout;
     self.http = $http;

     self.sce = $sce;
     self.location = $location;
     self.Upload = Upload;
     self.OptionsService = OptionsService;
     self.logger = new LogService();


     self.data_access_service = new DataAccessService();


     self.setupScopeMethods();

     self.initialize();



 };

 WebLinkController.prototype.setupScopeMethods = function() {
     var self = this;
     self.scope.fetch = function() {
        
         self.scope.showLoader = true;
         self.scope.uploadError = false;

         var postData = {
             url: self.scope.file.src,
             fileName: self.scope.file.name
         },
         headerData = {'x-csrf-token':$('meta[name=csrf]').attr("content")},
         requestData = {
            method: 'POST',
            url: '/fetch/',
            headers: headerData,
            data: postData
         };

         self.http(requestData).then(function(response) {
             self.scope.showLoader = false;
             if (response.data.error) {
                 self.scope.uploadError = response.data;
             } else {
                 var fileObj = {
                     path: response.data.path,
                     name: response.data.name,
                     size: response.data.size,
                     type: response.data.type,
                     src: window.location.origin + '/' + response.data.name
                 };
                 if (fileObj !== null && fileObj !== undefined){
                     self.OptionsService.addTempFile(fileObj);
                     self.location.path('/fetched_image_preview');
                     self.forceUpdateView();
                 }
             }
         });
     };

 };

 WebLinkController.prototype.initialize = function() {
     var self = this;
     self.scope.channels = self.OptionsService.getChannels();
     self.scope.options = self.OptionsService.getOptions();
     self.scope.limits = self.OptionsService.getLimits();
     self.scope.files = [];
     self.forceUpdateView();
 };

 WebLinkController.prototype.forceUpdateView = function(first_argument) {

     var self = this;
     self.timeout(function() {
         self.scope.$apply();
     });
 };

 app.controller('WebLinkController', WebLinkController);