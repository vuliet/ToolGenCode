var namespace = $('#NameSpace').val(); 
var screen = $('#ScreenName').val();  
var toLowerCaseScreen = lowercaseFirstLetter(screen);
var projectName = $('#ProjectName').val(); 
var moduleName = $('#ModuleName').val(); 

function GetFields() {
    namespace = $('#NameSpace').val(); 
    projectName = $('#ProjectName').val(); 
    screen = $('#ScreenName').val();
    toLowerCaseScreen = lowercaseFirstLetter(screen);
    moduleName = $('#ModuleName').val(); 
}

function Preview() {
    GetFields();
    $("#resultConstantsHelper").text(GenCode_ConstantsHelper());
    $("#resultCreateSettingCommand").text(GenCode_CreateSettingCommand());
    $("#resultUpdateSettingCommand").text(GenCode_UpdateSettingCommand());
    $("#resultGetSettingCommand").text(GenCode_GetSettingQuery());
    $("#resultAdminEndPoint").text(GenCode_AdminEndPoint());
    $("#resultUserEndPoint").text(GenCode_UserEndPoint());
    $("#resultCreateSettingHandler").text(GenCode_CreateSettingHandler());
    $("#resultUpdateSettingHandler").text(GenCode_UpdateSettingHandler());

    /*---Hiển thị màu của các đoạn code đã lấy được---*/
    $('pre code').each(function (i, block) {
        hljs.highlightBlock(block);
    });
}

function GenCode_ConstantsHelper(){
    var strConsttantsHelper = 'namespace ' + namespace +'.Helpers\n' +
                              '{\n' +
                              '    public class ' + moduleName + 'ConstantsHelper\n' +
                              '    {\n' +
                              '         private const string BaseEnpointUrlAdminPrefix = "api/v1/admins/'+ lowercaseFirstLetter(moduleName) +'s";\n' +
                              '         private const string BaseEnpointUrlUserPrefix = "api/v1/users/'+ lowercaseFirstLetter(moduleName) +'s";\n' +
                              '         private const string BaseEnpointGroup = "'+ moduleName +'s";\n' +
                              '    }\n' +
                              '}\n';
    return strConsttantsHelper;
}

function GenCode_CreateSettingCommand(){
    var strCreateSettingCommand = 'using System.Text.Json.Serialization;\n' +
                                  'using ' + projectName + '.Modules.Core.MediatR;;\n' +
                                  'using ' + projectName + '.Modules.Identity.Models.Dtos;\n' +
                                  'using ' + projectName + '.Modules.' + moduleName + '.Models.Entities;\n' +
                                  '\n' +
                                  'namespace ' + namespace +'.Models.Dtos.Commands\n' +
                                  '{\n' +
                                  '    public class Create' + screen + 'SettingCommand :\n' +       
                                  '\t'+     screen + 'SettingEntity,\n' +      
                                  '        IUserAuth,\n' +    
                                  '        ICommand<long>\n' +    
                                  '    {\n' +
                                  '        [JsonIgnore]\n' +
                                  '        public AppUserDto CurrentUser { get; set; }\n' +
                                  '    }\n' +
                                  '}\n';
    return strCreateSettingCommand;
}

function GenCode_UpdateSettingCommand(){
    var strUpdateSettingCommand = 'using System.Text.Json.Serialization;\n' +
                                  'using ' + projectName + '.Modules.Core.MediatR;;\n' +
                                  'using ' + projectName + '.Modules.Identity.Models.Dtos;\n' +
                                  'using System.ComponentModel.DataAnnotations;\n' +
                                  '\n' +
                                  'namespace ' + namespace +'.Models.Dtos.Commands\n' +
                                  '{\n' +
                                  '    public class Update' + screen + 'SettingCommand :\n' +           
                                  '        IUserAuth,\n' +    
                                  '        ICommand<bool>\n' +    
                                  '    {\n' +
                                  '        [JsonIgnore]\n' +
                                  '        public AppUserDto CurrentUser { get; set; }\n' +
                                  '\n' +
                                  '        [Required]\n' +
                                  '        public long Id { get; set; }\n' +
                                  '\n' +
                                  '        [Required]\n' +
                                  '        public DateTime ModificationDate { get; set; } = DateTime.UtcNow;\n' +
                                  '\n' +
                                  '        [Required]\n' +
                                  '        public long? ModificationUserId => CurrentUser.Id;\n' +
                                  '    }\n' +
                                  '}\n';
    return strUpdateSettingCommand;
}

function GenCode_GetSettingQuery(){
    var strGetSettingCommand = 'using System.Text.Json.Serialization;\n' +
                               'using ' + projectName + '.Modules.Core.MediatR;;\n' +
                               'using ' + projectName + '.Modules.Identity.Models.Dtos;\n' +
                               'using ' + projectName + '.Modules.' + screen + '.Models.Entities;\n' +
                               '\n' +
                               'namespace ' + namespace +'.Models.Dtos.Queries\n' +
                               '{\n' +
                               '    public class Get' + screen + 'SettingQuery :\n' +       
                               '        TableRequest,\n' +      
                               '        IUserAuth,\n' +    
                               '        IQuery<TableResult<' + screen + 'SettingEntity>>\n' +    
                               '    {\n' +
                               '        [JsonIgnore]\n' +
                               '        public AppUserDto CurrentUser { get; set; }\n' +
                               '    }\n' +
                               '}\n';
    return strGetSettingCommand;
}

function GenCode_AdminEndPoint(){
    var strAdminEndPoint = 'using Microsoft.AspNetCore.Routing;\n' +
                           'using ' + projectName + '.Modules.Identity.Extensions;\n' +
                           'using ' + projectName + '.Modules.Identity.Models.Base;\n' +
                           'using ' + namespace + '.Helpers;\n' +
                           'using ' + namespace + '.Models.Dtos.Commands;\n' +
                           'using ' + namespace + '.Models.Dtos.Queries;\n' +
                           'using ' + namespace + '.Models.Dtos.Responses;\n' +
                           'using ' + namespace + '.Models.Entities;\n' +
                           '\n' +
                           'namespace ' + namespace +'.Enpoints\n' +
                           '{\n' +
                           '    public static class AdminEndpoints\n' +
                           '    {\n' +
                           '         private const string prefix = '+ moduleName +'ConstantsHelper.BaseEnpointUrlAdminPrefix;\n' +
                           '         private const string group = '+ moduleName +'ConstantsHelper.BaseEnpointGroup;\n' +
                           '\n' +
                           '         public static void MapAdminEndpoints(this IEndpointRouteBuilder endpoint)\n' +
                           '         {\n' +
                           '             endpoint.MapPostAdminAuth<Get' + screen + 'SettingQuery, TableResult<' + screen + 'Entity>>(\n' +
                           '                 new BaseEnpointModel\n' +
                           '                 {\n' +
                           '                     Route = $"{prefix}/' + toLowerCaseScreen + '",\n' +
                           '                     Group = group,\n' +
                           '                     Title = "",\n' +
                           '                     Description = ""\n' +
                           '                 });\n' +
                           '\n' +
                           '             endpoint.MapPostAdminAuth<Create' + screen + 'SettingCommand, long>(\n' +
                           '                 new BaseEnpointModel\n' +
                           '                 {\n' +
                           '                     Route = $"{prefix}/' + toLowerCaseScreen + '",\n' +
                           '                     Group = group,\n' +
                           '                     Title = "",\n' +
                           '                     Description = ""\n' +
                           '                 });\n' +
                           '\n' +
                           '             endpoint.MapPutAdminAuth<Update' + screen + 'SettingCommand, bool>(\n' +
                           '                 new BaseEnpointModel\n' +
                           '                 {\n' +
                           '                     Route = $"{prefix}/' + toLowerCaseScreen + '",\n' +
                           '                     Group = group,\n' +
                           '                     Title = "",\n' +
                           '                     Description = ""\n' +
                           '                 });\n' +
                           '\n' +
                           '         }\n' +
                           '    }\n' +
                           '}\n';
    return strAdminEndPoint;
}

function GenCode_UserEndPoint(){
    var strUserEndPoint = 'using Microsoft.AspNetCore.Routing;\n' +
                          'using ' + projectName + '.Modules.Identity.Extensions;\n' +
                          'using ' + projectName + '.Modules.Identity.Models.Base;\n' +
                          'using ' + namespace + '.Helpers;\n' +
                          'using ' + namespace + '.Models.Dtos.Commands;\n' +
                          'using ' + namespace + '.Models.Dtos.Queries;\n' +
                          'using ' + namespace + '.Models.Dtos.Responses;\n' +
                          'using ' + namespace + '.Models.Entities;\n' +
                          '\n' +
                          'namespace ' + namespace +'.Enpoints\n' +
                          '{\n' +
                          '    public static class UserEndpoints\n' +
                          '    {\n' +
                          '         private const string prefix = '+ moduleName +'ConstantsHelper.BaseEnpointUrlUserPrefix;\n' +
                          '         private const string group = '+ moduleName +'ConstantsHelper.BaseEnpointGroup;\n' +
                           '\n' +
                           '         public static void MapUserEndpoints(this IEndpointRouteBuilder endpoint)\n' +
                           '         {\n' +
                           '\n' +
                           '         }\n' +
                           '    }\n' +
                           '}\n';
    return strUserEndPoint;
}

function GenCode_CreateSettingHandler(){
    var strCreatSettingHandler = 'using Microsoft.Extensions.DependencyInjection;\n' +
                                 'using Sprint.Modules.Core.MediatR;\n' +
                                 'using ' + projectName + '.Modules.Identity.Models.Base;\n' +
                                 'using ' + namespace + '.Models.Dtos.Commands;\n' +
                                 'using ' + namespace + '.Models.Dtos.Queries;\n' +
                                 'using ' + namespace + '.Repositories;\n' +
                                 '\n' +
                                 'namespace ' + namespace +'.Handlers.' + screen + '\n' +
                                 '{\n' +
                                 '    public partial class ' + screen + 'Handler : \n' +
                                 '        ICommandHandler<Create' + screen + 'SettingCommand, long> \n' +
                                 '    {\n' +
                                 '        public async Task<long> Handle(\n' +
                                 '            Create' + screen + 'SettingCommand request,\n' +
                                 '            CancellationToken cancellationToken\n' +
                                 '        {\n' +
                                 '            var db = _serviceProvider.GetRequiredService<I' + screen + 'Db>();\n' +
                                 '\n' +
                                 '            var entity = _mapper.Map<' + screen + 'SettingEntity>(request);\n'+
                                 '\n' +
                                 '            db.' + screen + 'Settings.Add(entity);\n' +
                                 '            await db.SaveChangesAsync();\n' +
                                 '\n' +
                                 '            return entity.Id;\n' +
                                 '         }\n' +
                                 '    }\n' +
                                 '}\n';
    return strCreatSettingHandler;
}

function GenCode_UpdateSettingHandler(){
    var strUpdateSettingHandler = 'using Microsoft.EntityFrameworkCore\n' +
                                  'using Microsoft.Extensions.DependencyInjection;\n' +
                                  'using Sprint.Modules.Core.MediatR;\n' +
                                  'using Sprint.Modules.Core.Exceptions;\n' +
                                  'using Sprint.Modules.Core.Helpers;\n' +
                                  'using ' + namespace + '.Models.Dtos.Commands;\n' +
                                  'using ' + namespace + '.Repositories;\n' +
                                  '\n' +
                                  'namespace ' + namespace +'.Handlers.' + screen + '\n' +
                                  '{\n' +
                                  '    public partial class ' + screen + 'Handler : \n' +
                                  '        ICommandHandler<Update' + screen + 'SettingCommand, bool> \n' +
                                  '    {\n' +
                                  '        public async Task<long> Handle(\n' +
                                  '            Update' + screen + 'SettingCommand request,\n' +
                                  '            CancellationToken cancellationToken\n' +
                                  '        {\n' +
                                  '            var db = _serviceProvider.GetRequiredService<I' + screen + 'Db>();\n' +
                                  '\n' +
                                  '            var entity = await db.' + screen + 'Settings\n'+
                                  '                .FirstOrDefaultAsync(x => x.Id == request.Id)\n' +
                                  '                ?? throw new AppException(AppError.RECORD_NOTFOUND);\n' +
                                  '\n' +
                                  '            var result = _mapper.Map(request, entity);\n' +
                                  '\n' +
                                  '            db.' + screen + 'Settings.Update(result);\n' +
                                  '            await db.SaveChangesAsync();\n' +
                                  '\n' +
                                  '            return true;\n' +
                                  '         }\n' +
                                  '    }\n' +
                                  '}\n';
    return strUpdateSettingHandler;
}

function DownloadAll() {
    Preview();
    setTimeout(() => {
        download(screen + 'ConstantsHelper.cs', GenCode_ConstantsHelper()); 
    }, 500);
    setTimeout(() => {
        download('Create' + screen + 'SettingCommand.cs', GenCode_CreateSettingCommand()); 
    }, 1000);
    setTimeout(() => {
        download('Update' + screen + 'SettingCommand.cs', GenCode_UpdateSettingCommand()); 
    }, 1500);
    setTimeout(() => {
        download('Get' + screen + 'SettingQuery.cs', GenCode_GetSettingQuery()); 
    }, 2000);
    setTimeout(() => {
        download('AdminEndpoints.cs', GenCode_AdminEndPoint());  
    }, 2500);
    setTimeout(() => {
        download('UserEndpoints.cs', GenCode_UserEndPoint()); 
    }, 3000);
    setTimeout(() => {
        download('Create' + screen + 'Setting.cs', GenCode_CreateSettingHandler()); 
    }, 3500);
    setTimeout(() => {
        download('Update' + screen + 'Setting.cs', GenCode_UpdateSettingHandler()); 
    }, 4000);
}

function download(filename, text) {
        var link = document.createElement('a');
        link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        link.setAttribute('download', filename);

        if (document.createEvent) {
            var event = document.createEvent('MouseEvents');
            event.initEvent('click', true, true);
            link.dispatchEvent(event);
        } else {
            link.click();
        }
}

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
