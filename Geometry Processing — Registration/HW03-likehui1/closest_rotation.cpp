#include "closest_rotation.h"
#include <Eigen/SVD>
#include <Eigen/Dense>


void closest_rotation(
	const Eigen::Matrix3d& M,
	Eigen::Matrix3d& R)
{
	//https://eigen.tuxfamily.org/dox/classEigen_1_1JacobiSVD.html


	Eigen::JacobiSVD<Eigen::MatrixXd> svd(M, Eigen::ComputeThinU | Eigen::ComputeThinV);
	Eigen::MatrixXd U = svd.matrixU();
	Eigen::MatrixXd V = svd.matrixV();
	Eigen::MatrixXd UV = U * (V.transpose());
	double determinant = UV.determinant();

	Eigen::MatrixXd omega;
	omega.resize(3, 3);
	omega.setIdentity();
	omega(2, 2) = determinant;
	
	R = U * omega * V.transpose();



}

