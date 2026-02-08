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


// configure ModelMapper class as a spring bean (public for clarity)
@Bean
public ModelMapper modelMapper() {
ModelMapper mapper = new ModelMapper();
mapper.getConfiguration() // get default config
.setPropertyCondition(Conditions.isNotNull()) // transfer only not null props from src-> dest
.setMatchingStrategy(MatchingStrategies.STRICT); // transfer the props form src -> dest which match by name & data type


// Additional safety: do not map password automatically from DTO -> Entity
mapper.typeMap(com.exam.dto.UserDTO.class, com.exam.entity.User.class)
.addMappings(mp -> mp.skip(com.exam.entity.User::setPassword));


return mapper;
}
}