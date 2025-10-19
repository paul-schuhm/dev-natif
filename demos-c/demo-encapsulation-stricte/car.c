#include <stdlib.h>
#include <stdio.h>
#include "car.h"

struct car{
  char* name;
  float price;
};

void* object_car_create(){
  car* c = malloc(sizeof(struct car));
  if(c != NULL)
    return c;
  return NULL;
}

void object_car_destroy(void* c){
  if(c != NULL)
    free(c);
}

void set_price(car* c, float price){
  struct car * sc = (struct car*)c;
  sc->price = price;
}

void object_car_print(car* c){
  struct car* sc = (struct car*)c;
  printf("Car\n");
  printf("Price:%f\n",sc->price);
}
