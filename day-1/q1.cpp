#include <stdio.h>
using namespace std;

int main()
{
    int first;

    printf("enter first number : ");
    scanf("%d", &first);

    if (first % 2 == 0)
    {
        printf("even number");
        printf("\n");
    }
    else
    {
        printf("odd number");
        printf("\n");
    }

    return 0;
}