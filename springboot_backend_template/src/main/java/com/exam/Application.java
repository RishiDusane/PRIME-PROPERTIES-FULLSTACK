package com.exam;

import org.modelmapper.Conditions;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper mapper = new ModelMapper();
        mapper.getConfiguration()
              .setPropertyCondition(Conditions.isNotNull())
              .setMatchingStrategy(MatchingStrategies.STRICT);

       
        mapper.typeMap(com.exam.dto.UserDTO.class, com.exam.entity.User.class)
              .addMappings(mp -> mp.skip(com.exam.entity.User::setPassword));

        return mapper;
    }
}