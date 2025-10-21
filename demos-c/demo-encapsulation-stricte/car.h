
//Pointeur opaque stricte.
typedef void car;

//API
void set_price(car* c, float price);
car* object_car_create();
void object_car_destroy(car*);
void object_car_print(car* c);
