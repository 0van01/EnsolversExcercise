using EnsolversExcercise.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading.Tasks;

namespace EnsolversExcercise.Controllers
{
    //Ruta del controller
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserTasksController : ControllerBase
    {
        private readonly MOCKENSOLVERSContext _dbContext;

        //Inyeccion de dependencias
        public UserTasksController(MOCKENSOLVERSContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("users")]
        public IActionResult GetUsers()
        {

            var query = _dbContext.Users.ToList();

            return new OkObjectResult(query);

        }

        [HttpGet("users/{auth0ID}")]
        public IActionResult GetUserByAuth0ID([FromRoute] string auth0ID)
        {
            auth0ID = "auth0|" + auth0ID;
            var query = _dbContext.Users.Where(x => x.Auth0ID == auth0ID).FirstOrDefault();

            return new OkObjectResult(query);

        }

        [HttpGet("folders")]
        public IActionResult GetFoldersListForUser(int id)
        {

            var query = _dbContext.Folders.ToList();

            return new OkObjectResult(query);
        }

        [HttpGet("folders/{id:int}")]
        public IActionResult GetFoldersForUser(int id)
        {
 
            var query = _dbContext.Folders.Where(x => x.FolderId == id).FirstOrDefault();

            return new OkObjectResult(query);
        }

        [HttpGet("tasks/folder/{id:int}")]
        public IActionResult GetTasksForUser(int id)
        {
            var query = _dbContext.UserTasks.Where(x => x.FolderId == id).ToList();

            return new OkObjectResult(query);
        }

        [HttpPost("tasks")]
        public async Task<IActionResult> PostTasksForUser([FromBody] UserTask task)
        {
            var query = _dbContext.UserTasks.Add(task);
            await _dbContext.SaveChangesAsync();
            return Ok(task);
        }

        [HttpPost("folders")]
        public async Task<IActionResult> PostFoldersForUser([FromBody] Folder folder)
        {
            var query = _dbContext.Folders.Add(folder);
            await _dbContext.SaveChangesAsync();
            return Ok(folder);
        }

        [HttpDelete("tasks/{id:int}")]
        public async Task<IActionResult> DeleteTasksForUser(int id)
        {
            var query = _dbContext.UserTasks.Where(x => x.TaskId == id).FirstOrDefault();
            if (query != null)
            {
                _dbContext.UserTasks.Remove(query);
                await _dbContext.SaveChangesAsync();
                return Ok("Object Deleted");
            }
            return NotFound();
        }

        [HttpDelete("folders/{id:int}")]
        public async Task<IActionResult> DeleteFoldersForUser(int id)
        {
            var query = _dbContext.Folders.Where(x => x.FolderId == id).FirstOrDefault();
            if (query != null)
            {
                _dbContext.Folders.Remove(query);
                await _dbContext.SaveChangesAsync();
                return Ok("Object Deleted");
            }
            return NotFound();
        }

        [HttpPatch("tasks")]
        public async Task<IActionResult> PatchTasksForUser([FromBody] UserTask task)
        {
            var query = _dbContext.UserTasks.SingleOrDefault(x => x.TaskId == task.TaskId);
            if (query != null)
            {
                query.Status = task.Status;
                query.Description = task.Description ?? query.Description;
                _dbContext.SaveChanges();
                return Ok(query);
            }
            return NotFound();
        }

        [HttpPatch("folders")]
        public async Task<IActionResult> PatchFoldersForUser([FromBody] Folder folder)
        {
            var query = _dbContext.Folders.SingleOrDefault(x => x.FolderId == folder.FolderId);
            if (query != null)
            {
                query.FolderName = folder.FolderName ?? query.FolderName;
                _dbContext.SaveChanges();
                return Ok(query);
            }
            return NotFound();
        }
    }
}
