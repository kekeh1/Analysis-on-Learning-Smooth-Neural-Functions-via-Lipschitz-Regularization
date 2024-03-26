#include "point_mesh_distance.h"
#include "point_triangle_distance.h"
#include <limits>
#include <igl/per_face_normals.h>

void point_mesh_distance(
	const Eigen::MatrixXd& X,
	const Eigen::MatrixXd& VY,
	const Eigen::MatrixXi& FY,
	Eigen::VectorXd& D,
	Eigen::MatrixXd& P,
	Eigen::MatrixXd& N)
{

	D.resize(X.rows());
	P.resize(X.rows(), 3);
	N.resize(X.rows(), 3);

	double d, min;
	Eigen::RowVector3d p, a, b, c, x, n, c_p;
	Eigen::MatrixXd normal;
	igl::per_face_normals(VY, FY, Eigen::Vector3d(1, 1, 1).normalized(), normal);

	for (int i = 0; i < X.rows(); i++) {

		x = X.row(i);
		min = std::numeric_limits<double>::infinity();


		for (int j = 0; j < FY.rows(); j++) {

			a = VY.row(FY(j, 0));
			b = VY.row(FY(j, 1));
			c = VY.row(FY(j, 2));
			point_triangle_distance(x, a, b, c, d, p);

			if (d < min) {
				min = d;
				n = normal.row(j);
				c_p = p;
			}

		}
		D(i) = d;
		P.row(i) = c_p;
		N.row(i) = n;

	}
}

