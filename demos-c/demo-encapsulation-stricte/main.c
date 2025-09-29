#include "car.h"
#include <stdio.h>

//Exemple d'utilisation d'une lib utilisant des pointeurs opaques (comme FILE de libc). On parle d'encapsulation stricte.

int main(){

  //Je manipule ici des pointeurs void que je ne peux pas déférencer ! Je ne peux pas manipuler car, je ne sais pas ce qu'il ya  dedans !
  //C'est l'encapsulation parfaite.

  car* c = object_car_create();

  //Erreur : impossible de déférencer un pointeur void !
  //printf("%f\n",c->price);

  set_price(c, 2500);
  object_car_print(c);
  object_car_destroy(c);

}
