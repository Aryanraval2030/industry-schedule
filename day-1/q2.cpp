#include <stdio.h>
using namespace std;

int main()
{

    int first;
    printf("enter first number : ");
    scanf("%d", &first);

    int second;
    printf("enter second number : ");
    scanf("%d", &second);

    if (first == second)
    {
        printf("both are same");
        printf("\n");
    }
    else if (first >= second)
    {

        printf("first number is largest");
        printf("\n");
    }
    else
    {
        printf("second number is largest");
        printf("\n");
    }

    return 0;
}