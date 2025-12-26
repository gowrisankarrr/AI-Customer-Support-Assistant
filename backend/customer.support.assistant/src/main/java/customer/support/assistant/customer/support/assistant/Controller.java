package customer.support.assistant.customer.support.assistant;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@CrossOrigin
@RestController
public class Controller {

    @Autowired
    AiService service;

    @Autowired
    Repository repository;

    @PostMapping("/chat")
    public Map<String, String> chat(@RequestBody Map<String, String> data) throws Exception {

        String query = data.get("query");
        String inputType = data.get("inputType");

        String aiResponse = service.generateResponse(query);

        Logs log = new Logs();
        log.setQuery(query);
        log.setResponse(aiResponse);
        log.setInputType(inputType);
        log.setTimestamp(LocalDateTime.now());

        repository.save(log);

        return Map.of("response", aiResponse);
    }

    @GetMapping("/admin/logs")
    public List<Logs> getAllLogs() {
        return repository.findAll();
    }

    @DeleteMapping("/admin/logs")
    public String deleteAllLogs() {
        repository.deleteAll();
        return "All logs deleted";
    }

}
