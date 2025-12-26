package customer.support.assistant.customer.support.assistant;

import org.springframework.data.mongodb.repository.MongoRepository;

@org.springframework.stereotype.Repository
public interface Repository extends MongoRepository<Logs,String> {
}
